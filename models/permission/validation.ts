import { Joi } from 'express-validation';

import { types } from '@/constants/json';
import { getAllResults, paramsValidation, updateStatus } from '@/models/shared/validation';

export const createPermissionValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    displayName: Joi.string().required(),
    module: Joi.string().required(),
    type: Joi.number()
      .valid(...Object.values(types))
      .required(),
  }),
};

export const getAllPermissionsValidation = {
  body: getAllResults.body.append({
    type: Joi.number().valid(...Object.values(types)),
  }),
  query: getAllResults.query,
};

export const updatePermissionStatusValidation = updateStatus;

export const deletePermissionValidation = {
  params: paramsValidation,
};
