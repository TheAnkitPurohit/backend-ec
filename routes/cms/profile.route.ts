import { Router as ExpressRouter } from 'express';

import {
  changePassword,
  getProfile,
  logout,
  updateProfile,
  validation,
} from '@/controllers/cms/profile.controller';
import { upload } from '@/helpers/image.controller';

const Router = ExpressRouter();

Router.get('/me', validation.getProfile, getProfile);
Router.put('/update', upload.single('avatar'), validation.updateAdminProfile, updateProfile);
Router.put('/change-password', validation.changePassword, changePassword);
Router.post('/logout', logout);

export default Router;
