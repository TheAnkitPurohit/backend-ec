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

export const getAllGroupValidation = {
  query: Joi.object({
    name: Joi.string().optional(),
    order: Joi.number().optional(),
    enabled: Joi.boolean().optional(),
    createdFrom: Joi.date().optional(),
    createdTo: Joi.date().optional(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
  }),
};

export const updateGroupValidation = {
  body: groupValidation.body,
  params: paramsValidation,
};

export const deleteGroupValidation = {
  params: paramsValidation,
};
