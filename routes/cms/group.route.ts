import { Router as ExpressRouter } from 'express';

import {
  createGroup,
  getAllGroup,
  getGroup,
  updateGroup,
  validation,
} from '@/controllers/cms/group.controller';

const Router = ExpressRouter();

Router.post('/create', validation.createGroupValidation, createGroup);
Router.get('/', getAllGroup);
Router.get('/:id', validation.getGroupValidation, getGroup);
Router.put('/update/:id', validation.updateGroupValidation, updateGroup);

export default Router;
