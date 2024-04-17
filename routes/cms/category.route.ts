import { Router as ExpressRouter } from 'express';

import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  validation,
} from '@/controllers/cms/category.controller';

const Router = ExpressRouter();

Router.post('/create', validation.createCategoryValidation, createCategory);
Router.get('/', validation.getAllCategoryValidation, getAllCategory);
Router.get('/:id', validation.getCategoryValidation, getCategory);
Router.put('/update/:id', validation.updateCategoryValidation, updateCategory);
Router.delete('/delete/:id', validation.deleteCategoryValidation, deleteCategory);

export default Router;
