import jwt from 'jsonwebtoken';

import config from '@/config';
import constants from '@/constants/constants';
import getData, { PREFIX } from '@/helpers/data.controller';
import { sendError } from '@/helpers/error.controller';
import { AppError, isAppError } from '@/utils/appError';
import { isObjEmpty } from '@/utils/helper';
import { encrypt, generateSecret } from '@/utils/security';

import type { GetMessage, GetShownData, GetToken, SendRes } from '@/types/helpers/fn.types';

const { JWT_EXPIRES_IN } = config;

const getMessage: GetMessage = (isEmpty, message, prefix, pagination, method) => {
  if (isEmpty) return constants.NO_DATA_FOUND();
  if (message) return message instanceof Function ? message() : message;
  if (method === 'POST' && !pagination) return constants.DATA_CREATED(prefix);
  if (method === 'PUT') return constants.DATA_UPDATED(prefix);
  if (method === 'PATCH') return constants.DATA_UPDATED(prefix);
  if (method === 'DELETE') return constants.DATA_DELETED(prefix);
  return constants.DATA_RETRIEVED(prefix);
};

const getShownData: GetShownData = (showData, pagination, rulesData, method) => {
  if (showData) return rulesData;

  if (showData === null) {
    if (pagination) return rulesData;
    if (method === 'GET') return rulesData;
    return undefined;
  }

  return undefined;
};

const getToken: GetToken = (userType, id) => {
  const secret = generateSecret(userType);
  const signedJWT = jwt.sign({ _id: id }, secret, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return encrypt(
    signedJWT,
    () => new AppError(constants.INVALID_TOKEN_ERROR, constants.UNAUTHORIZED)
  );
};

/* NOTE : addFields => add fields inside array of doc
extraFields => add fields inside object of data */
const sendRes: SendRes = (data, statusCode, req, res, options = {}) => {
  const { method, userType } = req;
  const {
    pagination = false,
    showData = null,
    message = undefined,
    prefix = PREFIX,
    showEmpty = false,
    extraFields = {},
    addFields = {},
    token = false,
  } = options;

  const getFilteredData = getData({
    prefix,
    pagination,
    data,
    extraFields,
    addFields,
  });

  const jwtToken = token ? getToken(userType, data._id.toString()) : undefined;
  if (isAppError(jwtToken)) return sendError(jwtToken, req, res);

  const isEmpty = isObjEmpty(data) || (Array.isArray(data) && !data.length);

  return res.status(isEmpty && !showEmpty ? constants.NOT_FOUND : statusCode).json({
    status: isEmpty && !showEmpty ? constants.NOT_FOUND : constants.SUCCESS,
    message: getMessage(isEmpty, message, prefix, pagination, method),
    token: jwtToken,
    results: pagination ? data.docs.length : data.length,
    data: getShownData(showData, pagination, getFilteredData, method),
  });
};

export default sendRes;
