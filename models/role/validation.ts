import { Joi } from 'express-validation';

import { types } from '@/constants/json';
import { getAllResults, paramsValidation, updateStatus } from '@/models/shared/validation';

const role = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array().items(Joi.string().required()).required(),
  type: Joi.number()
    .valid(...Object.values(types))
    .required(),
});

export const createRoleValidation = {
  body: role,
};

export const getRoleByIdValidation = {
  params: paramsValidation,
};

export const getAllRolesValidation = {
  body: getAllResults.body,
  query: getAllResults.query,
};

export const updateRoleStatusValidation = updateStatus;

export const updateRoleValidation = {
  body: role,
  params: paramsValidation,
};

export const deleteRoleValidation = {
  params: paramsValidation,
};
