import i18next from 'i18next';

import { languages } from '@/constants/json';

import type { ENext, EPartialReq, EReqLocals, ERes } from '@/types/express.types';

export const globalMiddleware = async (req: EPartialReq, res: ERes, next: ENext): Promise<void> => {
  const { headers } = req;

  req.isPostman = !!(
    headers['user-agent']?.startsWith('PostmanRuntime/') && headers['postman-token']
  );

  await i18next.changeLanguage(headers['accept-language'] ?? languages.ENGLISH);
  next();
};

export const createFieldInReq =
  <T extends keyof EReqLocals, R extends EReqLocals[T]>(key: T, value: R) =>
  (req: EPartialReq, res: ERes, next: ENext): void => {
    req[key] = value;
    next();
  };

export const noCache = (_: EPartialReq, res: ERes, next: ENext): void => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
};
