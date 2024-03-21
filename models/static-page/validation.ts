import { Joi } from 'express-validation';

import { getAllResults, paramsValidation } from '@/models/shared/validation';

const staticPage = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

export const createStaticPageValidation = {
  body: staticPage.body.append({
    slug: Joi.string().required(),
  }),
};

export const getStaticPageByIdValidation = {
  params: paramsValidation,
};

export const getAllStaticPagesValidation = getAllResults;

export const updateStaticPageValidation = {
  body: staticPage.body,
  params: paramsValidation,
};

export const deleteStaticPageValidation = {
  params: paramsValidation,
};
