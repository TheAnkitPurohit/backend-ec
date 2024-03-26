import { Router as ExpressRouter } from 'express';

import {
  forgotPassword,
  login,
  resendVerificationLink,
  resetPassword,
  signup,
  validation,
  verifyUser,
} from '@/controllers/shared/auth.controller';

const Router = ExpressRouter();

Router.post('/signup', validation.signup, signup);
Router.post('/login', validation.login, login);
Router.post('/forgot-password', validation.forgotPassword, forgotPassword);
Router.patch('/reset-password/:token', validation.resetPassword, resetPassword);
Router.post('/resend-verification-link', validation.resendVerificationLink, resendVerificationLink);
Router.patch('/verify-user/:token', validation.verifyUser, verifyUser);

export default Router;
