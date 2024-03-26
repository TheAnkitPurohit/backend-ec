import { Router as ExpressRouter } from 'express';

import {
  getAllUsers,
  getUser,
  softDeleteUser,
  updateStatus,
  updateUser,
  validation,
} from '@/controllers/shared/user.controller';

const Router = ExpressRouter();

Router.get('/lists/:id', validation.getUser, getUser);
Router.post('/lists', validation.getAllUsers, getAllUsers);
Router.patch('/update/status/:id', validation.updateStatus, updateStatus);
Router.put('/update/:id', validation.updateUser, updateUser);
Router.delete('/delete/:id', validation.softDeleteUser, softDeleteUser);

export default Router;
