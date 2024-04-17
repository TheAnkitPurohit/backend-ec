import { Joi } from 'express-validation';

import { paramsValidation } from '@/models/shared/validation';

const productValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    product_number: Joi.string().required(),
    weight: Joi.number().required(),
    category: Joi.string().required(),
    group: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    arraival_date: Joi.date(),
    is_free_delivery: Joi.boolean(),
    tax: Joi.number(),
    status: Joi.string(),
    isDeleted: Joi.boolean(),
  }),
};

export const createProductValidation = productValidation;

export const getAllProductValidation = {
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

export const getProductValidation = {
  params: paramsValidation,
};

export const updateProductValidation = {
  body: productValidation.body,
  params: paramsValidation,
};
