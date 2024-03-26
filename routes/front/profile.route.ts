import { Router as ExpressRouter } from 'express';

import {
  changePassword,
  deleteProfile,
  getProfile,
  logout,
  updateProfile,
  validation,
} from '@/controllers/shared/profile.controller';

const Router = ExpressRouter();

Router.post('/me', validation.getProfile, getProfile);
Router.put('/update', validation.updateProfile, updateProfile);
Router.patch('/change-password', validation.changePassword, changePassword);
Router.delete('/delete', deleteProfile);
Router.post('/logout', logout);

export default Router;
