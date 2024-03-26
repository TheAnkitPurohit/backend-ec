import { Router as ExpressRouter } from 'express';

import {
  createCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  validation,
} from '@/controllers/cms/category.controller';

const Router = ExpressRouter();

Router.post('/create', validation.createCategoryValidation, createCategory);
Router.get('/', getAllCategory);
Router.get('/:id', validation.getCategoryValidation, getCategory);
Router.put('/update/:id', validation.updateCategoryValidation, updateCategory);

export default Router;
