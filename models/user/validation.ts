import { Joi } from 'express-validation';

import {
  ObjectID,
  changePassword,
  forgotPassword,
  getAllResults,
  login,
  paramsValidation,
  resendVerificationLink,
  resetPassword,
  signup,
  tokenValidation,
  updateProfile,
  updateStatus,
} from '@/models/shared/validation';

export const signupValidation = signup;

export const loginValidation = login;

export const changePasswordValidation = changePassword;

export const forgotPasswordValidation = forgotPassword;

export const resetPasswordValidation = {
  body: resetPassword.body,
  params: tokenValidation,
};

export const resendVerificationLinkValidation = resendVerificationLink;

export const verifyUserValidation = {
  params: tokenValidation,
};

export const getProfileValidation = {
  body: Joi.object({
    fcm: Joi.string(),
  }),
};

export const updateProfileValidation = {
  body: updateProfile.body.append({
    username: Joi.string(),
  }),
};

export const getUserValidation = {
  params: paramsValidation,
};

export const getAllUsersValidation = {
  body: getAllResults.body.append({
    prison: ObjectID.optional().allow(''),
    isVerified: Joi.boolean().strict(true),
  }),
  query: getAllResults.query,
};

export const updateStatusValidation = updateStatus;

export const updateUserValidation = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string(),
    avatar: Joi.string(),
    mobile: Joi.string().required(),
    countryCode: Joi.string().required(),
    countryIsoCode: Joi.string().required(),
  }),
  params: paramsValidation,
};

export const softDeleteUserValidation = {
  params: paramsValidation,
};
