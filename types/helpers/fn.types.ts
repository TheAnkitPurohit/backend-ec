import type { HTTP_STATUSES } from '@/constants/constants';
import type { PREFIX } from '@/helpers/data.controller';
import type fields from '@/helpers/fields.controller';
import type { CapitalizeStrict, RecursiveType, RemoveUnderscore } from '@/types/common.types';
import type { EReq, ERes } from '@/types/express.types';
import type { AppError } from '@/utils/appError';

export type ActualFieldsKeys = keyof typeof fields;
export type FieldsKeys = CapitalizeStrict<RemoveUnderscore<ActualFieldsKeys>>;
export type FieldsKeysWithData = FieldsKeys | typeof PREFIX;

export type StatusCode = (typeof HTTP_STATUSES)[keyof typeof HTTP_STATUSES];

export type GetToken = (userType: EReq['userType'], id: string) => string | AppError;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type OrgData = any;
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type RulesData = any;

export type GetMessage = (
  isEmpty: boolean,
  message: ResOptions['message'],
  prefix: FieldsKeysWithData,
  pagination: NonNullable<ResOptions['pagination']>,
  method: EReq['method']
) => string;

export type GetShownData = (
  showData: ResOptions['showData'],
  pagination: NonNullable<ResOptions['pagination']>,
  rulesData: RulesData | undefined,
  method: EReq['method']
) => RulesData | undefined;

export interface ResOptions {
  pagination?: boolean;
  showData?: boolean | null;
  message?: string | (() => string);
  prefix?: FieldsKeys;
  showEmpty?: boolean;
  extraFields?: RecursiveType<unknown>;
  addFields?: Record<string, boolean>;
  token?: boolean;
}

export type SendRes = (
  data: OrgData,
  statusCode: StatusCode,
  req: EReq,
  res: ERes,
  options?: ResOptions
) => ERes;
