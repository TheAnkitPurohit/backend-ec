import { Router as ExpressRouter } from 'express';

import constants from '@/constants/constants';
import { AppError } from '@/utils/appError';

const Router = ExpressRouter();

Router.all('*', ({ originalUrl }, _, next) => {
  next(new AppError(constants.ROUTE_NOT_FOUND(originalUrl), constants.NOT_FOUND));
});

export default Router;
