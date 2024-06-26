import constants from '@/constants/constants';
import sendRes from '@/helpers/fn.controller';
import Group from '@/models/group/group.model';
import {
  createGroupValidation,
  deleteGroupValidation,
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

  const group = await Group.find({ name: body.name, isDeleted: false });

  if (group.length > 0)
    return next(new AppError(constants.ALREADY_EXISTS('Group'), constants.BAD_REQUEST));

  const data = await Group.create(body);

  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, {
    message: constants.DATA_CREATED('Group'),
    showData: false,
  });
});

export const getAllGroup = catchAsync(async (req, res) => {
  const data = await Group.find({ isDeleted: false }, { _id: 1, name: 1, enabled: 1 });

  return sendRes(data, constants.SUCCESS, req, res, {
    message: constants.DATA_RETRIEVED('Group'),
    showData: true,
    showEmpty: true,
  });
});

validation.getGroupValidation = validator(getGroupValidation);
export const getGroup = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = await Group.findOne(
    { _id: id, isDeleted: false, enabled: true },
    { _id: 1, name: 1, enabled: 1 }
  );

  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, {
    message: constants.DATA_RETRIEVED('Group'),
  });
});

validation.updateGroupValidation = validator(updateGroupValidation);
export const updateGroup = catchAsync(async (req, res, next) => {
  const { body } = req;
  const { id } = req.params;

  const existingGroup = await Group.findOne({ _id: id, isDeleted: false });

  if (!existingGroup) {
    return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));
  }

  if (body.name) {
    const duplicateGroup = await Group.findOne({ name: body.name, isDeleted: false });

    if (duplicateGroup && duplicateGroup._id.toString() !== id) {
      return next(new AppError(constants.ALREADY_EXISTS('Group'), constants.BAD_REQUEST));
    }
  }

  const updatedGroup = await Group.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: body },
    { runValidators: true, new: true }
  );

  if (!updatedGroup) {
    return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));
  }

  return sendRes(updatedGroup, constants.SUCCESS, req, res, {
    message: constants.DATA_UPDATED('Group'),
  });
});

validation.deleteGroupValidation = validator(deleteGroupValidation);
export const deleteGroup = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const adminId = req.user._id;

  const existingGroup = await Group.findOne({ _id: id, isDeleted: false });

  if (!existingGroup) {
    return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));
  }

  const updatedGroup = await Group.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: adminId,
        enabled: false,
      },
    },
    { new: true }
  );

  if (!updatedGroup) {
    return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));
  }

  return sendRes(updatedGroup, constants.SUCCESS, req, res, {
    message: constants.DATA_DELETED('Group'),
  });
});
