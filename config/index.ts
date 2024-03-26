import * as process from 'process';

import type { EnvironmentTypes as EnvTypes } from '@/types/config.types';

type EnvironmentTypes = keyof EnvTypes;
type Environment = Exclude<keyof EnvTypes, 'common'>;
type Switch = 'ON' | 'OFF';
type EmailMode = 'mailtrap' | 'google';
type Logger = 'access' | 'combined' | 'error' | 'access-error' | 'combined-error' | 'OFF';

const config = {
  NODE_ENV: process.env.NODE_ENV as Environment,
  ENV_NAME: process.env.ENV_NAME as EnvironmentTypes,

  PORT: process.env.PORT as string,

  ERROR_MODE: process.env.ERROR_MODE as Environment,

  RULES_MODE: process.env.RULES_MODE as Switch,
  SECURE_MODE: process.env.SECURE_MODE as Switch,
  RATE_LIMIT: process.env.RATE_LIMIT as Switch,
  LOGGER: process.env.LOGGER as Logger,

  CLIENT_URL: process.env.CLIENT_URL as string,
  TOKEN_HEADER_NAME: process.env.TOKEN_HEADER_NAME as string,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY as string,

  DB_URI: process.env.DB_URI as string,

  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,

  EMAIL_TOKEN_SECRET: process.env.EMAIL_TOKEN_SECRET as string,
  EMAIL_TOKEN_EXPIRES_IN: process.env.EMAIL_TOKEN_EXPIRES_IN as string,

  // CLIENT_EMAIL: process.env.CLIENT_EMAIL as string,
  // CLIENT_ID: process.env.CLIENT_ID as string,
  // CLIENT_SECRET: process.env.CLIENT_SECRET as string,
  // CLIENT_REFRESH_TOKEN: process.env.CLIENT_REFRESH_TOKEN as string,

  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
  AWS_REGION: process.env.AWS_REGION as string,

  AWS_URL: process.env.AWS_URL as string,
  AWS_BUCKET: process.env.AWS_BUCKET as string,
  AWS_FOLDER: process.env.AWS_FOLDER as string,
  AWS_PRIVATE_BUCKET: process.env.AWS_PRIVATE_BUCKET as string,
  AWS_PRIVATE_FOLDER: process.env.AWS_PRIVATE_FOLDER as string,

  DEFAULT_TAX: process.env.DEFAULT_TAX !== undefined ? parseFloat(process.env.DEFAULT_TAX) : 0,

  ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET as string,
  ADMIN_JWT_SECRET_REF: process.env.ADMIN_JWT_SECRET_REF as string,

  USER_JWT_SECRET: process.env.USER_JWT_SECRET as string,
  USER_JWT_SECRET_REF: process.env.USER_JWT_SECRET_REF as string,

  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY as string,

  PRODUCT_STATUS: ['ACTIVE', 'DEACTIVATED'],
  INQUIRY_STATUS: [
    'INQUIRY_PENDING',
    'INQUIRY_REJECTED',
    'INQUIRY_ACCEPTED',
    'INQUIRY_CANCELLED',
    'INQUIRY_FINISH',
  ],

  ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
};

export default config;
