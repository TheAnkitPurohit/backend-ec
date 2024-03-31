import { Joi } from 'express-validation';

import {
  emailValidation,
  login,
  passwordValidation,
  resetPassword,
  tokenValidation,
} from '@/models/shared/validation';

export const updateAdminProfileValidation = {
  body: Joi.object({
    name: Joi.string().required(),
  }),
};

export const createAdminValidation = {
  body: Joi.object({
    email: emailValidation,
  }),
};

export const verifyEmailValidation = {
  params: tokenValidation,
};

export const resetPasswordValidation = {
  body: resetPassword.body.append({
    token: Joi.string().required(),
  }),
  params: tokenValidation,
};

export const generateTokenValidation = {
  body: Joi.object({
    refreshTokenAdmin: Joi.string().required(),
  }),
};

export const loginValidation = login;
