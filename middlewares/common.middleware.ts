import rateLimit from 'express-rate-limit';

import constants from '@/constants/constants';

import type { ENext, ENextHandler, EPartialReq, ERes } from '@/types/express.types';

export const rateLimiter = (): ENextHandler =>
  rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: { message: constants.RATE_LIMIT_ERROR },
  });

export const passMiddleware = (req: EPartialReq, res: ERes, next: ENext): void => next();
