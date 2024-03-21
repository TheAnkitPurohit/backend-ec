import type { languages } from '@/constants/json';
import type { ValueOf } from 'type-fest';

export interface JWTPayload {
  _id: string;
}

export type Language = ValueOf<typeof languages>;

export type ParserType = 'json' | 'fileUpload';

export type GetFileSize = (type: ParserType, originalUrl: string) => number;
