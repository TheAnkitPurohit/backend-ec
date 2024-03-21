import express from 'express';
import expressFileUpload from 'express-fileupload';

import type { ENext, EPartialReq, ERes } from '@/types/express.types';
import type { GetFileSize, ParserType } from '@/types/middlewares.types';
import type { IncomingMessage } from 'http';

const MAX_FILE_SIZE_MB = 100;
const FILE_SIZE_MB = 10;

const excludedRoutes: Record<ParserType, string[]> = {
  json: [],
  fileUpload: [],
};

const getFileSize: GetFileSize = (type, originalUrl) =>
  excludedRoutes[type].includes(originalUrl) ? MAX_FILE_SIZE_MB : FILE_SIZE_MB;

export const expressJsonParser = async (req: EPartialReq, res: ERes, next: ENext): Promise<void> =>
  void express.json({
    limit: `${getFileSize('json', req.originalUrl)}mb`,
    verify: (_req: IncomingMessage & { rawBody: string }, _, buf) => {
      // eslint-disable-next-line no-param-reassign
      _req.rawBody = buf.toString();
    },
  })(req, res, next);

export const fileUploadParser = async (req: EPartialReq, res: ERes, next: ENext): Promise<void> =>
  void expressFileUpload({
    limits: {
      fileSize: getFileSize('fileUpload', req.originalUrl) * 1024 * 1024,
    },
    abortOnLimit: true,
  })(req, res, next);
