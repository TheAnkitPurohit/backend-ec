import constants from '@/constants/constants';

import type { ECoreReq, ENext, ENextError, EReq, ERes } from '@/types/express.types';
import type { AppErrorType } from '@/types/utils/appError.types';

export class AppError extends Error {
  public messages: AppErrorType['messages'];
  public statusCode: AppErrorType['statusCode'];
  public status: AppErrorType['statusCode'];
  public extraFields: AppErrorType['extraFields'];
  public isOperational: AppErrorType['isOperational'];

  static getMessage = (message: AppErrorType['message']): string => {
    if (message instanceof Function) return message() as string;
    return Array.isArray(message) ? message[0] : message;
  };

  constructor(
    message: AppErrorType['message'],
    statusCode: AppErrorType['statusCode'],
    extraFields: AppErrorType['extraFields'] = {}
  ) {
    super();
    this.message = AppError.getMessage(message);
    this.messages = Array.isArray(message) ? message : undefined;
    this.statusCode = statusCode || (constants.SERVER_ERROR as number);
    this.status = statusCode;
    this.extraFields = extraFields;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const catchAsync =
  (fn: (req: EReq, res: ERes, next: ENextError) => Promise<ERes | AppError>) =>
  async (r: ECoreReq, s: ERes, n: ENext): Promise<void> => {
    // @ts-expect-error I want to return everytime so changing some logic of returning ( AKA Personal Choice )
    fn(r, s, n).catch(n);
  };

export const isAppError = (AppErrorArg: unknown): AppErrorArg is AppError =>
  AppErrorArg instanceof AppError;
