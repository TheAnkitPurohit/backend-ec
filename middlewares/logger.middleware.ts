import path from 'node:path';

import expressWinston from 'express-winston';
import { transports } from 'winston';

import config from '@/config';
import { passMiddleware } from '@/middlewares/common.middleware';
import { getFullURL, rootPath } from '@/utils/helper';

import type { BaseLoggerOptions, RequestFilter } from 'express-winston';

const { LOGGER } = config;

const requestWhitelist = ['fullURL', 'headers', 'method', 'httpVersion', 'query', 'params', 'user'];

const requestFilter: RequestFilter = (req, propName) => {
  if (propName === 'fullURL') return getFullURL(req);
  if (propName === 'user') return req.user?._id;
  if (propName === 'headers') {
    return {
      host: req.headers.host,
      contentType: req.headers['content-type'],
      acceptLanguage: req.headers['accept-language'],
      userAgent: req.headers['user-agent'],
    };
  }
  return req[propName];
};

const coreLogger: BaseLoggerOptions = {
  statusLevels: true,
  expressFormat: true,
  requestWhitelist,
  requestFilter,
};

// PRINTS 2xx, 3xx, 4xx, 5xx logs
const accessLogger = expressWinston.logger({
  ...coreLogger,
  transports: [
    new transports.File({
      level: 'info',
      filename: path.join(rootPath, 'logs', 'access.log'),
    }),
  ],
});

// PRINTS 3xx, 4xx, 5xx logs
const combinedLogger = expressWinston.logger({
  ...coreLogger,
  transports: [
    new transports.File({
      level: 'warn',
      filename: path.join(rootPath, 'logs', 'combined.log'),
    }),
  ],
});

// PRINTS 5xx logs
const errorLogger = expressWinston.errorLogger({
  level: (_, res, err) => {
    if (err && 'statusCode' in err && typeof err.statusCode === 'number') {
      return err.statusCode.toString().startsWith('5') ? 'error' : 'info';
    }
    return 'info';
  },
  transports: [
    new transports.File({
      level: 'error',
      filename: path.join(rootPath, 'logs', 'error.log'),
    }),
  ],
  msg: '{{err.message}}',
  requestWhitelist,
  requestFilter,
});

const logger = () => {
  const loggerArr = LOGGER.split('-');
  const isAccessLogger = loggerArr.includes('access');
  const isCombinedLogger = loggerArr.includes('combined');
  const isErrorLogger = loggerArr.includes('error');

  const getAccessLogger = () => {
    if (isAccessLogger) return accessLogger;
    if (isCombinedLogger) return combinedLogger;
    return passMiddleware;
  };

  return {
    accessLogger: getAccessLogger(),
    errorLogger: isErrorLogger ? errorLogger : passMiddleware,
  };
};

export default logger();
