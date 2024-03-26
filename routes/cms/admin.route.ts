import { Router as ExpressRouter } from 'express';

import { create, list, validation } from '@/controllers/cms/admin.controller';

const Router = ExpressRouter();

Router.post('/create', validation.create, create);
Router.get('/list', list);

export default Router;
