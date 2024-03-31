import { Router as ExpressRouter } from 'express';

import { createProduct, validation } from '@/controllers/cms/product.controller';

const Router = ExpressRouter();

Router.post('/create', validation.createProductValidation, createProduct);
export default Router;
