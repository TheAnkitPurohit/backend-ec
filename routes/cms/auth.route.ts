import { Router as ExpressRouter } from 'express';

import {
  generateToken,
  login,
  resetPassword,
  validation,
  verifyEmail,
} from '@/controllers/cms/auth.controller';
import { upload } from '@/helpers/image.controller';

const Router = ExpressRouter();

Router.post('/login', validation.login, login);
Router.post('/generate-token', validation.generateTokenValidation, generateToken);
Router.get('/verify-email/:token', validation.verifyEmailValidation, verifyEmail);
Router.post(
  '/set-password',
  upload.single('avatar'),
  validation.resetPasswordValidation,
  resetPassword
);

export default Router;
