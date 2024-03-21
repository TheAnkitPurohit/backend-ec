import { Router as ExpressRouter } from 'express';

import {
  forgotPassword,
  login,
  resetPassword,
  validation,
} from '@/controllers/shared/auth.controller';

const Router = ExpressRouter();

Router.post('/login', validation.login, login);
Router.post('/forgot-password', validation.forgotPassword, forgotPassword);
Router.patch('/reset-password/:token', validation.resetPassword, resetPassword);

export default Router;
