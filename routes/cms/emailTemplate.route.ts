import { Router as ExpressRouter } from 'express';

import {
  createEmailTemplate,
  getAllEmailTemplates,
  getEmailTemplate,
  softDeleteEmailTemplate,
  updateEmailTemplate,
  validation,
} from '@/controllers/cms/emailTemplate.controller';

const Router = ExpressRouter();

Router.post('/create', validation.createEmailTemplate, createEmailTemplate);
Router.get('/lists/:id', validation.getEmailTemplate, getEmailTemplate);
Router.post('/lists', validation.getAllEmailTemplates, getAllEmailTemplates);
Router.put('/update/:id', validation.updateEmailTemplate, updateEmailTemplate);
Router.delete('/delete/:id', validation.softDeleteEmailTemplate, softDeleteEmailTemplate);

export default Router;
