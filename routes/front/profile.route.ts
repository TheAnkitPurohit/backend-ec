import { Router as ExpressRouter } from 'express';

import {
  changePassword,
  deleteProfile,
  getProfile,
  logout,
  updateProfile,
  validation,
} from '@/controllers/shared/profile.controller';
import permissions from '@/middlewares/permissions.middleware';

const Router = ExpressRouter();

Router.post('/me', validation.getProfile, getProfile);
Router.put('/update', permissions, validation.updateProfile, updateProfile);
Router.patch('/change-password', permissions, validation.changePassword, changePassword);
Router.delete('/delete', permissions, deleteProfile);
Router.post('/logout', logout);

export default Router;
