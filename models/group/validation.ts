import { Joi } from 'express-validation';

import { paramsValidation } from '@/models/shared/validation';

const groupValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    enabled: Joi.boolean(),
  }),
};

export const createGroupValidation = groupValidation;

export const getGroupValidation = {
  params: paramsValidation,
};

export const updateGroupValidation = {
  body: groupValidation.body,
  params: paramsValidation,
};
