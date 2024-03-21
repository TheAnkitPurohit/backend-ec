import { Router as ExpressRouter } from 'express';

import {
  createPermission,
  deletePermission,
  getAllPermissions,
  updatePermissionStatus,
  validation,
} from '@/controllers/cms/permission.controller';
import permissions from '@/middlewares/permissions.middleware';

const Router = ExpressRouter();

Router.post('/create', permissions, validation.createPermission, createPermission);
Router.post('/lists', permissions, validation.getAllPermissions, getAllPermissions);
Router.patch(
  '/update/status/:id',
  permissions,
  validation.updatePermissionStatus,
  updatePermissionStatus
);
Router.delete('/delete/:id', permissions, validation.deletePermission, deletePermission);

export default Router;
