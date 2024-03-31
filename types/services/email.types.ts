import type { Obj, ObjectId } from '@/types/common.types';
import type { PlatformType } from '@/types/constants.types';
import type { AppError } from '@/utils/appError';

export type EmailSlug = 'welcome' | 'reset-password' | 'change-password';

export type Extra = Obj<string>;

export type EmailArgs = Record<
  EmailSlug,
  {
    subject: string;
    dynamicValues?: (extra: Extra) => Extra | Promise<Extra>;
  }
>;

export interface EmailService {
  to: string | string[];
  cc?: string | string[] | undefined;
  bcc?: string | string[] | undefined;
  extra?: Extra;
}

export interface EmailServiceOptions {
  content: string;
  values: string[];
  extra: Extra;
}

export interface EmailToken {
  slug: EmailSlug;
  email: EmailService;
  noLog?: boolean;
}

interface EmailUser extends ObjectId {
  userType: PlatformType;
}

export type SendEmail = (user: EmailUser, data: EmailToken) => Promise<true | AppError>;

export type GetEncryptedEmailToken = (
  id: ObjectId['_id']
) => Record<'token' | 'encryptedToken', string> | AppError;

export type GetDecryptedEmailToken = (token: string) => Record<'id' | 'token', string> | AppError;
