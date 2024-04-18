import { Router as ExpressRouter } from 'express';

import { create, deActive, list, validation } from '@/controllers/cms/admin.controller';

const Router = ExpressRouter();

Router.post('/create', validation.create, create);
Router.get('/list', list);
Router.put('/deactive', validation.deactiveAdminValidation, deActive);

export default Router;
