import { Router as ExpressRouter } from 'express';

import {
  createStaticPage,
  deleteStaticPage,
  getAllStaticPages,
  getStaticPage,
  updateStaticPage,
  validation,
} from '@/controllers/cms/staticPage.controller';
import permissions from '@/middlewares/permissions.middleware';

const Router = ExpressRouter();

Router.post('/create', permissions, validation.createStaticPage, createStaticPage);
Router.get('/lists/:id', permissions, validation.getStaticPage, getStaticPage);
Router.post('/lists', permissions, validation.getAllStaticPages, getAllStaticPages);
Router.put('/update/:id', permissions, validation.updateStaticPage, updateStaticPage);
Router.delete('/delete/:id', permissions, validation.deleteStaticPage, deleteStaticPage);

export default Router;
