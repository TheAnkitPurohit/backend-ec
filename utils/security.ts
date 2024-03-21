import crypto from 'crypto';

import config from '@/config';

import type { PlatformType } from '@/types/constants.types';
import type { AppError } from '@/utils/appError';

const { ENCRYPTION_KEY, JWT_SECRET } = config;

// GENERATE RANDOM CRYPTO TOKEN
export const generateRandomToken = (): string => crypto.randomBytes(32).toString('hex');

// GENERATE ENCRYPTED CRYPTO TOKEN WITH SECRET
export const generateEncryptToken = (token: string, key: string): string =>
  crypto.createHmac('sha256', key).update(token).digest('hex');

export const encrypt = (text: string, cb: (e: unknown) => AppError): string | AppError => {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  } catch (e) {
    return cb(e);
  }
};

export const decrypt = (text: string, cb: (e: unknown) => AppError): string | AppError => {
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift() as string, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (e) {
    return cb(e);
  }
};

export const generateSecret = (type: PlatformType): string => {
  const secretArr = JWT_SECRET.split('');
  const secret = [...secretArr.slice(0, type), type, ...secretArr.slice(type)];
  return secret.join('');
};
