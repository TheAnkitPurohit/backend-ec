import { Router as ExpressRouter } from 'express';

import constants from '@/constants/constants';
import { types } from '@/constants/json';
import { isAdmin, isMainAdmin } from '@/middlewares/auth.middleware';
import { createFieldInReq } from '@/middlewares/global.middleware';
import adminRoute from '@/routes/cms/admin.route';
import authRoute from '@/routes/cms/auth.route';
import categoryRoute from '@/routes/cms/category.route';
import dashboardRoute from '@/routes/cms/dashboard.route';
import groupRoute from '@/routes/cms/group.route';
import profileRoute from '@/routes/cms/profile.route';
import userRoute from '@/routes/cms/user.route';
import notFoundRoute from '@/routes/shared/notFound.route';

const Router = ExpressRouter();

Router.get('/', (req, res) => res.send(constants.CMS_HANDSHAKE()));

Router.use('/auth', createFieldInReq('userType', types.CMS), authRoute, notFoundRoute);

Router.use(isAdmin);

Router.use('/admin', isMainAdmin, adminRoute);

Router.use('/profile', profileRoute);
Router.use('/user', userRoute);
Router.use('/dashboard', dashboardRoute);
Router.use('/category', categoryRoute);
Router.use('/group', groupRoute);
Router.use('/product', groupRoute);

export default Router;
