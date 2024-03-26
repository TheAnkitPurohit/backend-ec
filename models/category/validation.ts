import { Joi } from 'express-validation';

import { paramsValidation } from '@/models/shared/validation';

const categoryValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    enabled: Joi.boolean(),
  }),
};

export const createCategoryValidation = categoryValidation;

export const getCategoryValidation = {
  params: paramsValidation,
};

export const updateCategoryValidation = {
  body: categoryValidation.body,
  params: paramsValidation,
};
