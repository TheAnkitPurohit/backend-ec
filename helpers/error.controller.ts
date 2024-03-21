import chalk from 'chalk';
import { ValidationError } from 'express-validation';

import config from '@/config';
import constants from '@/constants/constants';
import { AppError } from '@/utils/appError';

import type { SendError, ValidationErrors } from '@/types/helpers/error.types';
import type { ErrorRequestHandler } from 'express';
import type { CastError } from 'mongoose';

const { ERROR_MODE } = config;

const handleCastErrorDB = (err: CastError) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, constants.BAD_REQUEST);

const handleDuplicateFieldsDB = (err: { keyValue: string }) => {
  const dupField = Object.keys(err.keyValue)[0];
  const message = `${dupField} already exists.`;
  return new AppError(message, constants.BAD_REQUEST);
};

const handleValidationErrorDB = (error: ValidationErrors, isJoi: boolean) => {
  const errorArr = isJoi ? error.body ?? error.query ?? error.params : error;
  if (!errorArr) return new AppError(constants.TECHNICAL_ERROR, constants.SERVER_ERROR);

  const errors = Object.values(errorArr).map(cur => cur.message);
  return new AppError(errors, constants.BAD_REQUEST);
};

const handleJWTError = () => new AppError(constants.INVALID_TOKEN_ERROR, constants.UNAUTHORIZED);

const handleJWTExpiredError = () =>
  new AppError(constants.TOKEN_EXPIRED_ERROR, constants.UNAUTHORIZED);

const handleJSONParseError = () => new AppError(constants.JSON_PARSE_ERROR, constants.FORBIDDEN);

export const sendError: SendError = (err, req, res) => {
  const isErrorModeProduction = ERROR_MODE === 'production';

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    messages: err.messages,
    ...err.extraFields,
    ...(isErrorModeProduction ? null : { error: err, stack: err.stack }),
  });
};

const sendErrorDev: ErrorRequestHandler = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) return sendError(err, req, res);

  console.error(chalk.blue('Development Error'));
  console.error(`${chalk.red('ERROR 💥')} | ${chalk.cyan(err.message)}`);
  return void res.status(err.statusCode).render('error', { message: err.message });
};

const sendErrorProd: ErrorRequestHandler = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) return sendError(err, req, res);

    console.error(chalk.blue('Production Operational Error'));
    console.error(`${chalk.red('ERROR 💥')} | ${chalk.cyan(err.message)}`);
    return res.status(constants.SERVER_ERROR).json({
      status: constants.SERVER_ERROR,
      message: constants.UNKNOWN_ERROR,
    });
  }

  if (err.isOperational) {
    return void res.status(err.statusCode).render('error', { message: err.message });
  }

  console.error(chalk.blue('Production Unknown Error'));
  console.error(`${chalk.red('ERROR 💥 ')} | ${chalk.cyan(err.message)}`);
  return void res.status(err.statusCode).render('error', { message: err.message });
};

const errorController: ErrorRequestHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-param-reassign
  err.statusCode = err.statusCode || constants.SERVER_ERROR;
  // eslint-disable-next-line no-param-reassign
  err.status = err.status || 'ERROR';

  if (ERROR_MODE === 'production') {
    // @ts-expect-error status is coming
    const JSONParseError = err instanceof SyntaxError && err.status === 400 && 'body' in err;
    let error = { ...err };
    error.message = err.message;
    error.name = err.name || undefined;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (err instanceof ValidationError) error = handleValidationErrorDB(error.details, true);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error.errors, false);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (JSONParseError) error = handleJSONParseError();
    return void sendErrorProd(error, req, res, next);
  }

  return void sendErrorDev(err, req, res, next);
};

export default errorController;
