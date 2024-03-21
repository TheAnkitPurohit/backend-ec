import constants from '@/constants/constants';
import sendRes from '@/helpers/fn.controller';
import {
  makeDateParams,
  makeParams,
  makeSearchParams,
  makeSortParams,
} from '@/helpers/pagination.controller';
import User from '@/models/user/user.model';
import {
  getAllUsersValidation,
  getUserValidation,
  softDeleteUserValidation,
  updateStatusValidation,
  updateUserValidation,
} from '@/models/user/validation';
import { s3Delete, s3UploadSignedUrl } from '@/services/aws.service';
import { AppError, catchAsync } from '@/utils/appError';
import { validator } from '@/utils/helper';

import type { ValidationType } from '@/types/common.types';

export const validation: ValidationType = {};

validation.getUser = validator(getUserValidation);
export const getUser = catchAsync(async (req, res, next) => {
  const { params } = req;
  const { id } = params;

  const aggregateParams = makeParams({ isActive: true });
  const pipeline = User.getUserPipeline({ id });

  const [data] = await User.aggregate([...aggregateParams, ...pipeline]);
  if (!data) return next(new AppError(constants.ID_NOT_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, { prefix: 'User' });
});

validation.getAllUsers = validator(getAllUsersValidation);
export const getAllUsers = catchAsync(async (req, res) => {
  const { body, query } = req;
  const { page = 1, limit = constants.PER_PAGE_LIMIT } = query;
  const {
    search,
    fields,
    sort,
    sortBy,
    dateField,
    startDate,
    endDate,
    pagination = true,
    isActive = undefined,
    isVerified = undefined,
  } = body;

  const params = makeParams({ isActive, isVerified });

  const searchParams = () => makeSearchParams(search, fields);

  const sortParams = () => makeSortParams(sort, sortBy);

  const dateParams = () => makeDateParams(dateField, startDate, endDate);

  const pipeline = User.getUserPipeline({ id: null });

  const aggregate = User.aggregate([
    ...pipeline,
    ...params,
    { $match: searchParams() },
    { $match: dateParams() },
    { $sort: sortParams() },
  ]);

  const data = await User.aggregatePaginate(aggregate, { page: +page, limit: +limit, pagination });

  return sendRes(data, constants.SUCCESS, req, res, {
    pagination: true,
    prefix: 'User',
  });
});

validation.updateStatus = validator(updateStatusValidation);
export const updateStatus = catchAsync(async (req, res, next) => {
  const { body, params } = req;
  const { id } = params;

  const data = await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      $set: {
        isActive: body.status,
      },
    },
    { runValidators: true, projection: '_id' }
  );

  if (!data) return next(new AppError(constants.ID_NOT_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, { prefix: 'User' });
});

validation.updateUser = validator(updateUserValidation);
export const updateUser = catchAsync(async (req, res, next) => {
  const { params, body } = req;
  const { id } = params;
  let uploadDetails;

  const user = await User.findOne({ _id: id, isActive: true }).select('avatar');
  if (!user) return next(new AppError(constants.ID_NOT_FOUND, constants.BAD_REQUEST));

  if (body.avatar) {
    if (user.avatar) await s3Delete(user.avatar);
    const upload = await s3UploadSignedUrl({ name: body.avatar }, 'users');
    if (!upload) return next(new AppError(constants.S3_ERROR, constants.SERVER_ERROR));

    uploadDetails = upload;
    body.avatar = upload.path;
  }

  const data = await User.findOneAndUpdate({ _id: id, isActive: true }, body, {
    runValidators: true,
    projection: '_id',
  });

  if (!data) return next(new AppError(constants.INVALID_FILE, constants.BAD_REQUEST));

  return sendRes({ uploadDetails }, constants.SUCCESS, req, res, {
    prefix: 'User',
    showData: !!uploadDetails,
  });
});

validation.softDeleteUser = validator(softDeleteUserValidation);
export const softDeleteUser = catchAsync(async (req, res, next) => {
  const { params, user } = req;
  const { id } = params;

  const data = await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      $set: { isActive: false, isDeleted: true, deletedAt: new Date(), deletedBy: user._id },
    },
    { runValidators: true, projection: '_id' }
  );

  if (!data) return next(new AppError(constants.ID_NOT_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, { prefix: 'User' });
});
