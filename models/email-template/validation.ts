import { Joi } from 'express-validation';

import { getAllResults, paramsValidation } from '@/models/shared/validation';

const emailTemplate = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    values: Joi.array().items(Joi.string().required()).required(),
  }),
};

export const createEmailTemplateValidation = {
  body: emailTemplate.body.append({
    slug: Joi.string().required(),
  }),
};

export const getEmailTemplateByIdValidation = {
  params: paramsValidation,
};

export const getAllEmailTemplatesValidation = getAllResults;

export const updateEmailTemplateValidation = {
  body: emailTemplate.body,
  params: paramsValidation,
};

export const softDeleteEmailTemplateValidation = {
  params: paramsValidation,
};
