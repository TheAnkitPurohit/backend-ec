import { Router as ExpressRouter } from 'express';

import {
  createEmailTemplate,
  getAllEmailTemplates,
  getEmailTemplate,
  softDeleteEmailTemplate,
  updateEmailTemplate,
  validation,
} from '@/controllers/cms/emailTemplate.controller';
import permissions from '@/middlewares/permissions.middleware';

const Router = ExpressRouter();

Router.post('/create', permissions, validation.createEmailTemplate, createEmailTemplate);
Router.get('/lists/:id', permissions, validation.getEmailTemplate, getEmailTemplate);
Router.post('/lists', permissions, validation.getAllEmailTemplates, getAllEmailTemplates);
Router.put('/update/:id', permissions, validation.updateEmailTemplate, updateEmailTemplate);
Router.delete(
  '/delete/:id',
  permissions,
  validation.softDeleteEmailTemplate,
  softDeleteEmailTemplate
);

export default Router;
