import { Router as ExpressRouter } from 'express';

import { getDashboardLists } from '@/controllers/cms/dashboard.controller';

const Router = ExpressRouter();

Router.get('/lists', getDashboardLists);

export default Router;
