import { Joi } from 'express-validation';

import { paramsValidation } from '@/models/shared/validation';

const categoryValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    order: Joi.number().default(0),
    enabled: Joi.boolean(),
  }),
};

export const createCategoryValidation = categoryValidation;

export const getCategoryValidation = {
  params: paramsValidation,
};

export const getAllCategoryValidation = {
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

export const updateCategoryValidation = {
  body: categoryValidation.body,
  params: paramsValidation,
};

export const deleteCategoryValidation = {
  params: paramsValidation,
};
