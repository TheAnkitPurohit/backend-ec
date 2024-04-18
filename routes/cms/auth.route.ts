import { Router as ExpressRouter } from 'express';

import {
  forgotPassword,
  generateToken,
  login,
  resetPassword,
  validation,
  verifyToken,
} from '@/controllers/cms/auth.controller';
import { upload } from '@/helpers/image.controller';

const Router = ExpressRouter();

Router.post('/login', validation.login, login);
Router.post('/generate-token', validation.generateTokenValidation, generateToken);
Router.get('/verify-token/:token', validation.verifyTokenValidation, verifyToken);
Router.post('/set-password', validation.resetPasswordValidation, resetPassword);
Router.post('/forgot-password', validation.forgotPasswordValidation, forgotPassword);

export default Router;
