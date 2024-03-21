import constants from '@/constants/constants';
import sendRes from '@/helpers/fn.controller';
import { makeParams } from '@/helpers/pagination.controller';
import Permission from '@/models/permission/permission.model';
import {
  createPermissionValidation,
  deletePermissionValidation,
  getAllPermissionsValidation,
  updatePermissionStatusValidation,
} from '@/models/permission/validation';
import { AppError, catchAsync } from '@/utils/appError';
import { validator } from '@/utils/helper';

import type { ValidationType } from '@/types/common.types';

export const validation: ValidationType = {};

const generatePermissionName = (name: string) => {
  if (name.length > 1) {
    if (name.endsWith('/')) return name.slice(0, -1);
    if (!name.startsWith('/')) return `/${name}`;
    return name;
  }
  return name;
};

validation.createPermission = validator(createPermissionValidation);
export const createPermission = catchAsync(async (req, res, next) => {
  const { body } = req;

  const permission = { ...body, name: generatePermissionName(body.name) };

  const data = await Permission.create(permission);
  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.CREATED, req, res, { prefix: 'Permission' });
});

validation.getAllPermissions = validator(getAllPermissionsValidation);
export const getAllPermissions = catchAsync(async (req, res) => {
  const { query, body } = req;
  const { page = 1, limit = constants.PER_PAGE_LIMIT } = query;
  const { pagination = true, type = undefined } = body;

  const params = makeParams({ type, isActive: true });

  const aggregate = Permission.aggregate([...params]);
  const data = await Permission.aggregatePaginate(aggregate, {
    page: +page,
    limit: +limit,
    pagination,
  });

  return sendRes(data, constants.SUCCESS, req, res, {
    pagination: true,
    prefix: 'Permission',
  });
});

validation.updatePermissionStatus = validator(updatePermissionStatusValidation);
export const updatePermissionStatus = catchAsync(async (req, res, next) => {
  const { params, body } = req;
  const { id } = params;

  const data = await Permission.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        isActive: body.status,
      },
    },
    { runValidators: true, projection: '_id' }
  );

  if (!data) return next(new AppError(constants.ID_NOT_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, { prefix: 'Permission' });
});

validation.deletePermission = validator(deletePermissionValidation);
export const deletePermission = catchAsync(async (req, res, next) => {
  const { params } = req;
  const { id } = params;

  const data = await Permission.findOneAndDelete({ _id: id });
  if (!data) return next(new AppError(constants.ID_NOT_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, { prefix: 'Permission' });
});
