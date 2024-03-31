import { Router as ExpressRouter } from 'express';

import {
  createGroup,
  deleteGroup,
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
Router.delete('/delete/:id', validation.deleteGroupValidation, deleteGroup);

export default Router;
