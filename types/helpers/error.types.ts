import type { ECoreReq, ENext, ERes } from '@/types/express.types';
import type { AppError } from '@/utils/appError';
import type { ValidationError as JoiValidationError } from 'express-validation';

interface MessageObj {
  message: string;
}

type JoiValidationErrorDetails = JoiValidationError['details'];

interface MongoValidationError {
  name: 'ValidationError';
  errors: Record<string, MessageObj>;
}

export type ValidationErrors = JoiValidationErrorDetails & MongoValidationError;

export type SendError = (err: AppError, req: ECoreReq, res: ERes, next?: ENext) => ERes;
