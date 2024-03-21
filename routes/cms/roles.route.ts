import { Router as ExpressRouter } from 'express';

import {
  createRole,
  deleteRole,
  getAllRoles,
  getRole,
  updateRole,
  updateRoleStatus,
  validation,
} from '@/controllers/cms/roles.controller';
import permissions from '@/middlewares/permissions.middleware';

const Router = ExpressRouter();

Router.post('/create', permissions, validation.createRole, createRole);
Router.get('/lists/:id', permissions, validation.getRole, getRole);
Router.post('/lists', permissions, validation.getAllRoles, getAllRoles);
Router.patch('/update/status/:id', permissions, validation.updateRoleStatus, updateRoleStatus);
Router.put('/update/:id', permissions, validation.updateRole, updateRole);
Router.delete('/delete/:id', permissions, validation.deleteRole, deleteRole);

export default Router;
