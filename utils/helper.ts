import path from 'node:path';

import { validate } from 'express-validation';
import { Types } from 'mongoose';

import config from '@/config';
import constants from '@/constants/constants';
import { mimeTypes } from '@/constants/json';
import { AppError } from '@/utils/appError';

import type { Obj } from '@/types/common.types';
import type { MimeType } from '@/types/constants.types';
import type { ENextHandler, EReq } from '@/types/express.types';
import type { UploadedFile } from 'express-fileupload';
import type { EvOptions as SchemaOptions, schema as ValidationSchema } from 'express-validation';

const { NODE_ENV } = config;

// RETURN ROOT PATH
export const rootPath = path.resolve();

// RETURN BASE URL OF PROJECT
export const getBaseURL = <T extends Pick<EReq, 'protocol' | 'hostname'>>(req: T): string =>
  `${req.protocol}://${req.hostname}`;

// RETURN FULL URL OF ROUTE
export const getFullURL = <T extends Pick<EReq, 'protocol' | 'hostname' | 'originalUrl'>>(
  req: T
): string => `${getBaseURL(req)}${req.originalUrl}`;

// CHECK IS ENVIRONMENT PRODUCTION OR NOT
export const isProduction = NODE_ENV === 'production';

// CHECK IS OBJECT
export const isObject = <T, U = undefined>(obj: U extends undefined ? Obj<T> : T): boolean =>
  typeof obj === 'object' && obj !== null;

// CHECK OBJECT IS EMPTY OR NOT
export const isObjEmpty = <T, U = undefined>(obj: U extends undefined ? Obj<T> : T): boolean =>
  Object.getOwnPropertyNames(obj).length === 0;

// CHECK ARRAY IS EMPTY OR NOT
export const isArrEmpty = <T = unknown>(arr: T[]): boolean => !(Array.isArray(arr) && arr.length);

export const toObjectId = (id: string): Types.ObjectId => new Types.ObjectId(id);

// VALIDATOR FOR JOI
export const validator = (schema: ValidationSchema, options: SchemaOptions = {}): ENextHandler =>
  validate(schema, options, { abortEarly: false });

// CHECK THE IMAGE MIME
export const isFileValid = (
  files: EReq['files'],
  field: string,
  isRequired = false,
  mimeType: MimeType = 'image'
): boolean | AppError => {
  const isValid = files?.[field] && !Array.isArray(files[field]);

  if (isValid) {
    const { mimetype: fileMimeType } = files[field] as UploadedFile;
    const { mimeType: detailsMimeType, included, excluded } = mimeTypes[mimeType];

    const isValidMimeType = fileMimeType.startsWith(detailsMimeType);
    const isEveryMimeTypeIncluded = !Array.isArray(included);
    const isMimeTypeIncluded = Array.isArray(included) && included.includes(fileMimeType);
    const isExcludedPresent = excluded.includes(fileMimeType);

    const isDetailsValid =
      isValidMimeType && !isExcludedPresent && (isEveryMimeTypeIncluded || isMimeTypeIncluded);

    return isDetailsValid ? true : new AppError(constants.INVALID_FILE, constants.BAD_REQUEST);
  }

  return isRequired ? new AppError(constants.UPLOAD_FILE, constants.BAD_REQUEST) : false;
};

// CONVERT TO FIXED DECIMAL NUMBER
export const toFixedNumber = (num: number, digits = 2, base = 10): number => {
  const pow = base ** digits;
  return Math.round(num * pow) / pow;
};

// CHECK ITS JSON OR NOT
export const isJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const escapeRegex = (str: string): string => str.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
