import { Router as ExpressRouter } from 'express';

import constants from '@/constants/constants';
import { types } from '@/constants/json';
import protect from '@/middlewares/auth.middleware';
import { createFieldInReq } from '@/middlewares/global.middleware';
import authRoute from '@/routes/cms/auth.route';
import dashboardRoute from '@/routes/cms/dashboard.route';
import emailTemplateRoute from '@/routes/cms/emailTemplate.route';
import permissionsRoute from '@/routes/cms/permissions.route';
import profileRoute from '@/routes/cms/profile.route';
import rolesRoute from '@/routes/cms/roles.route';
import staticPageRoute from '@/routes/cms/staticPage.route';
import userRoute from '@/routes/cms/user.route';
import notFoundRoute from '@/routes/shared/notFound.route';

const Router = ExpressRouter();

Router.get('/', (req, res) => res.send(constants.CMS_HANDSHAKE()));

Router.use('/auth', createFieldInReq('userType', types.CMS), authRoute, notFoundRoute);

Router.use(protect);

Router.use('/profile', profileRoute);
Router.use('/user', userRoute);
Router.use('/permissions', permissionsRoute);
Router.use('/roles', rolesRoute);
Router.use('/dashboard', dashboardRoute);
Router.use('/email-template', emailTemplateRoute);
Router.use('/static-page', staticPageRoute);

export default Router;
