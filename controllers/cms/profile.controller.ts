import constants from '@/constants/constants';
import sendRes from '@/helpers/fn.controller';
import { deleteUploadedFile } from '@/helpers/image.controller';
import Admin from '@/models/user/admin/admin.model';
import { updateAdminProfileValidation } from '@/models/user/admin/validation';
import getUserOrAdminModel from '@/models/user/model';
import { changePasswordValidation, getProfileValidation } from '@/models/user/validation';
import { AppError, catchAsync } from '@/utils/appError';
import { validator } from '@/utils/helper';

import type { ValidationType } from '@/types/common.types';

export const validation: ValidationType = {};

validation.getProfile = validator(getProfileValidation);
export const getProfile = catchAsync(async (req, res, next) => {
  const { user } = req;

  const data = await Admin.findOne({
    _id: user._id,
  });

  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, {
    message: constants.DATA_RETRIEVED('Admin Profile'),
    showData: true,
  });
});

validation.updateAdminProfile = validator(updateAdminProfileValidation);
export const updateProfile = catchAsync(async (req, res, next) => {
  const { body, user } = req;

  const admin = await Admin.findOne({
    _id: user._id,
  });
  if (!admin) {
    if (req.file) {
      deleteUploadedFile(req.file.filename);
    }
    return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));
  }

  admin.name = body.name;

  if (admin.avatar && req.file) {
    deleteUploadedFile(admin.avatar);
  }

  if (req.file) {
    admin.avatar = req.file.filename;
  }

  await admin.save();

  return sendRes(
    {
      _id: admin._id,
    },
    constants.SUCCESS,
    req,
    res,
    {
      message: constants.DATA_UPDATED('Admin Profile'),
    }
  );
});

validation.changePassword = validator(changePasswordValidation);
export const changePassword = catchAsync(async (req, res, next) => {
  const { body, user } = req;
  const { currentPassword, newPassword } = body;

  const userData = await Admin.findOne({
    _id: user._id,
  }).select('+password');
  if (!userData) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  const checkPass = await userData.comparePassword(currentPassword, userData.password);
  if (!checkPass) return next(new AppError(constants.PASSWORD_WRONG, constants.BAD_REQUEST));

  const data = await Admin.findOneAndUpdate(
    { _id: userData._id },
    {
      $set: { password: newPassword },
    },
    { runValidators: true, projection: '_id' }
  );

  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(userData, constants.SUCCESS, req, res, {
    message: constants.CHANGE_PASSWORD_MESSAGE,
  });
});

export const logout = catchAsync(async (req, res, next) => {
  const { user } = req;

  const data = await Admin.findOneAndUpdate(
    { _id: user._id },
    {
      $set: { refresh_token_id: null },
    },
    { runValidators: true, projection: '_id' }
  );

  if (!data) return next(new AppError(constants.ID_NOT_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, { message: constants.LOGOUT_MESSAGE });
});
