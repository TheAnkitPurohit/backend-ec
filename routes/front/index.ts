import { Router as ExpressRouter } from 'express';

import constants from '@/constants/constants';
import { types } from '@/constants/json';
import protect from '@/middlewares/auth.middleware';
import { createFieldInReq } from '@/middlewares/global.middleware';
import authRouter from '@/routes/front/auth.route';
import profileRoute from '@/routes/front/profile.route';
import notFoundRoute from '@/routes/shared/notFound.route';

const Router = ExpressRouter();

Router.get('/', (req, res) => res.send(constants.FRONT_HANDSHAKE()));

Router.use('/auth', createFieldInReq('userType', types.FRONT), authRouter, notFoundRoute);

Router.use(protect);

Router.use('/profile', profileRoute);

export default Router;
