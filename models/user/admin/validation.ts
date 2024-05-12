import { Joi } from 'express-validation';

import { emailValidation, login, resetPassword, tokenValidation } from '@/models/shared/validation';

export const createAdminValidation = {
  body: Joi.object({
    email: emailValidation,
    name: Joi.string().required(),
  }),
};

export const getAllAdminValidation = {
  query: Joi.object({
    name: Joi.string().optional(),
    status: Joi.boolean().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
  }),
};

export const deactiveAdminValidation = {
  body: Joi.object({
    email: emailValidation,
  }),
};

export const updateAdminProfileValidation = {
  body: Joi.object({
    name: Joi.string().required(),
  }),
};

export const verifyTokenValidation = {
  params: tokenValidation,
};

export const resetPasswordValidation = {
  body: resetPassword.body.append({
    token: Joi.string().required(),
  }),
  params: tokenValidation,
};

export const forgotPasswordValidation = {
  body: Joi.object({
    email: emailValidation,
  }),
};

export const generateTokenValidation = {
  body: Joi.object({
    refreshTokenAdmin: Joi.string().required(),
  }),
};

export const loginValidation = login;
