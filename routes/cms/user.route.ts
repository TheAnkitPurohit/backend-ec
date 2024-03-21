import { Router as ExpressRouter } from 'express';

import {
  getAllUsers,
  getUser,
  softDeleteUser,
  updateStatus,
  updateUser,
  validation,
} from '@/controllers/shared/user.controller';
import permissions from '@/middlewares/permissions.middleware';

const Router = ExpressRouter();

Router.get('/lists/:id', permissions, validation.getUser, getUser);
Router.post('/lists', permissions, validation.getAllUsers, getAllUsers);
Router.patch('/update/status/:id', permissions, validation.updateStatus, updateStatus);
Router.put('/update/:id', permissions, validation.updateUser, updateUser);
Router.delete('/delete/:id', permissions, validation.softDeleteUser, softDeleteUser);

export default Router;
