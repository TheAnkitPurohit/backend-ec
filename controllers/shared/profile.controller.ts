import constants from '@/constants/constants';
import { Roles } from '@/constants/json';
import { createEmailLog } from '@/helpers/email.controller';
import sendRes from '@/helpers/fn.controller';
import { updateAdminProfileValidation } from '@/models/user/admin/validation';
import getUserOrAdminModel from '@/models/user/model';
import {
  changePasswordValidation,
  getProfileValidation,
  updateProfileValidation,
} from '@/models/user/validation';
import { s3Delete, s3UploadSignedUrl } from '@/services/aws.service';
import { AppError, catchAsync } from '@/utils/appError';
import { validator } from '@/utils/helper';

import type { ValidationType } from '@/types/common.types';

export const validation: ValidationType = {};

validation.getProfile = validator(getProfileValidation);
export const getProfile = catchAsync(async (req, res, next) => {
  const { body, user, userType } = req;
  const { fcm = null } = body;

  const isAdmin = Roles.isAdmin(userType);
  const Model = getUserOrAdminModel(userType);

  const curUser = await Model.findOneAndUpdate(
    { _id: user._id },
    { $set: { fcm } },
    { runValidators: true, projection: '_id' }
  );

  if (!curUser) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  const data = await Model.getUser({ id: user._id.toString(), isPermissionsRequired: true });
  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, {
    prefix: isAdmin ? 'Admin Profile' : 'Profile',
    message: constants.DATA_RETRIEVED('Profile'),
    showData: true,
  });
});

validation.updateProfile = validator(updateProfileValidation);
validation.updateAdminProfile = validator(updateAdminProfileValidation);
export const updateProfile = catchAsync(async (req, res, next) => {
  const { body, user, userType } = req;
  let uploadDetails;

  const Model = getUserOrAdminModel(userType);

  const curUser = await Model.findOne({ _id: user._id }).select('avatar');
  if (!curUser) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  if (body.avatar) {
    if (curUser.avatar) await s3Delete(curUser.avatar);
    const upload = await s3UploadSignedUrl({ name: body.avatar }, 'users');
    if (!upload) return next(new AppError(constants.S3_ERROR, constants.SERVER_ERROR));

    uploadDetails = upload;
    body.avatar = upload.path;
  }

  const data = await Model.findOneAndUpdate({ _id: user._id }, body, {
    runValidators: true,
    projection: '_id',
  });

  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes({ uploadDetails }, constants.SUCCESS, req, res, {
    prefix: 'Profile',
    showData: !!uploadDetails,
  });
});

validation.changePassword = validator(changePasswordValidation);
export const changePassword = catchAsync(async (req, res, next) => {
  const { body, user, userType } = req;
  const { currentPassword, newPassword } = body;

  const Model = getUserOrAdminModel(userType);

  const userData = await Model.findOne({ _id: user._id }).select('+password');
  if (!userData) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  const checkPass = await userData.comparePassword(currentPassword, userData.password);
  if (!checkPass) return next(new AppError(constants.PASSWORD_WRONG, constants.BAD_REQUEST));

  const data = await Model.findOneAndUpdate(
    { _id: userData._id },
    {
      $set: { password: newPassword },
    },
    { runValidators: true, projection: '_id' }
  );

  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  await createEmailLog(
    { _id: userData._id, userType },
    { slug: 'change-password', status: constants.MAIL_SUCCESS(), fulfilledAt: new Date() }
  );

  return sendRes(userData, constants.SUCCESS, req, res, {
    message: constants.CHANGE_PASSWORD_MESSAGE,
  });
});

export const deleteProfile = catchAsync(async (req, res, next) => {
  const { user, userType } = req;

  const Model = getUserOrAdminModel(userType);

  const data = await Model.findOneAndUpdate(
    { _id: user._id },
    {
      $set: { isActive: false, isDeleted: true, deletedAt: new Date(), deletedBy: user._id },
    },
    { runValidators: true, projection: '_id' }
  );

  if (!data) return next(new AppError(constants.ID_NOT_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, { prefix: 'Profile' });
});

export const logout = catchAsync(async (req, res, next) => {
  const { user, userType } = req;

  const Model = getUserOrAdminModel(userType);

  const data = await Model.findOneAndUpdate(
    { _id: user._id },
    {
      $set: { fcm: null },
    },
    { runValidators: true, projection: '_id' }
  );

  if (!data) return next(new AppError(constants.ID_NOT_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, { message: constants.LOGOUT_MESSAGE });
});
