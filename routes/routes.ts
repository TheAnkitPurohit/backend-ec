import { Router as ExpressRouter } from 'express';

import constants from '@/constants/constants';
import type from '@/middlewares/identify.middleware';
import cmsRoute from '@/routes/cms';
import frontRoute from '@/routes/front';

const Router = ExpressRouter();

Router.get('/', (req, res) => res.send(constants.API_HANDSHAKE()));

Router.use('/front', type('FRONT'), frontRoute);
Router.use('/cms', type('CMS'), cmsRoute);

export default Router;
