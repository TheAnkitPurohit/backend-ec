import type { UserExtendedSchema } from '@/models/user/shared/common.types';
import type { PlatformType } from '@/types/constants.types';
import type { AppError } from '@/utils/appError';
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
  RequestHandler,
} from 'express';
import type { Types } from 'mongoose';

interface EReqLocalUser {
  _id: Types.ObjectId;
}

export interface EReqLocals {
  rawBody: string;
  isPostman: boolean;
  isCMS: boolean;
  userType: PlatformType;
  user: EReqLocalUser;
  permissions: UserExtendedSchema<true>['permissions'];
}

export type ECoreReq = ExpressRequest;

export type EPartialReq = ExpressRequest & Partial<EReqLocals>;

export type EReq = ExpressRequest & EReqLocals;

export type ERes = ExpressResponse;

export type ENext = NextFunction;

export type ENextError = (err?: AppError | 'router' | 'route') => AppError;

export type ENextHandler = RequestHandler;
