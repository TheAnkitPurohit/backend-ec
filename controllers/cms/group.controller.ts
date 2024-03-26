import constants from '@/constants/constants';
import sendRes from '@/helpers/fn.controller';
import Group from '@/models/group/group.model';
import {
  createGroupValidation,
  getGroupValidation,
  updateGroupValidation,
} from '@/models/group/validation';
import { AppError, catchAsync } from '@/utils/appError';
import { validator } from '@/utils/helper';

import type { ValidationType } from '@/types/common.types';

export const validation: ValidationType = {};

validation.createGroupValidation = validator(createGroupValidation);
export const createGroup = catchAsync(async (req, res, next) => {
  const { body } = req;

  const data = await Group.create(body);

  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, {
    message: constants.DATA_CREATED('Group'),
    showData: false,
  });
});

export const getAllGroup = catchAsync(async (req, res, next) => {
  const data = await Group.find();

  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, {
    message: constants.DATA_RETRIEVED('Group'),
  });
});

validation.getGroupValidation = validator(getGroupValidation);
export const getGroup = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = await Group.findOne({ _id: id });

  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, {
    message: constants.DATA_RETRIEVED('Group'),
  });
});

validation.updateGroupValidation = validator(updateGroupValidation);
export const updateGroup = catchAsync(async (req, res, next) => {
  const { body } = req;

  const { id } = req.params;

  const data = await Group.findOneAndUpdate(
    { _id: id },
    { $set: body },
    { runValidators: true, projection: '_id' }
  );
  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, {
    message: constants.DATA_UPDATED('Group'),
  });
});
