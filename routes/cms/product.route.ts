import { Router as ExpressRouter } from 'express';

import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  validation,
} from '@/controllers/cms/product.controller';

const Router = ExpressRouter();

Router.post('/create', validation.createProductValidation, createProduct);
Router.get('/', validation.getAllProductValidation, getAllProducts);
Router.get('/:id', validation.getProductValidation, getProduct);
Router.put('/update/:id', validation.updateProductValidation, updateProduct);

export default Router;
