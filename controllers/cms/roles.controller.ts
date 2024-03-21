import constants from '@/constants/constants';
import sendRes from '@/helpers/fn.controller';
import {
  makeDateParams,
  makeParams,
  makeSearchParams,
  makeSortParams,
} from '@/helpers/pagination.controller';
import Role from '@/models/role/role.model';
import {
  createRoleValidation,
  deleteRoleValidation,
  getAllRolesValidation,
  getRoleByIdValidation,
  updateRoleStatusValidation,
  updateRoleValidation,
} from '@/models/role/validation';
import Admin from '@/models/user/admin/admin.model';
import User from '@/models/user/user.model';
import { AppError, catchAsync } from '@/utils/appError';
import { validator } from '@/utils/helper';

import type { ValidationType } from '@/types/common.types';

export const validation: ValidationType = {};

validation.createRole = validator(createRoleValidation);
export const createRole = catchAsync(async (req, res, next) => {
  const { body } = req;

  const data = await Role.create(body);
  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.CREATED, req, res, { prefix: 'Role' });
});

validation.getRole = validator(getRoleByIdValidation);
export const getRole = catchAsync(async (req, res, next) => {
  const { params } = req;
  const { id } = params;

  const aggregateParams = makeParams({ isActive: true });
  const pipeline = Role.getRole({ id });

  const [data] = await Role.aggregate([...aggregateParams, ...pipeline]);
  if (!data) return next(new AppError(constants.ID_NOT_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, { prefix: 'Role' });
});

validation.getAllRoles = validator(getAllRolesValidation);
export const getAllRoles = catchAsync(async (req, res) => {
  const { query, body } = req;
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
  } = body;

  const params = makeParams({ isActive });

  const searchParams = () => makeSearchParams(search, fields);

  const sortParams = () => makeSortParams(sort, sortBy);

  const dateParams = () => makeDateParams(dateField, startDate, endDate);

  const rolePipeline = Role.getRole({ id: null });

  const aggregate = Role.aggregate([
    ...params,
    ...rolePipeline,
    { $match: searchParams() },
    { $match: dateParams() },
    { $sort: sortParams() },
  ]);

  const data = await Role.aggregatePaginate(aggregate, { page: +page, limit: +limit, pagination });

  return sendRes(data, constants.SUCCESS, req, res, {
    pagination: true,
    prefix: 'Role',
  });
});

validation.updateRoleStatus = validator(updateRoleStatusValidation);
export const updateRoleStatus = catchAsync(async (req, res, next) => {
  const { params, body } = req;
  const { id } = params;

  const data = await Role.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        isActive: body.status,
      },
    },
    { runValidators: true, projection: '_id' }
  );

  if (!data) return next(new AppError(constants.ID_NOT_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, { prefix: 'Role' });
});

validation.updateRole = validator(updateRoleValidation);
export const updateRole = catchAsync(async (req, res, next) => {
  const { params, body } = req;
  const { id } = params;

  const data = await Role.findOneAndUpdate(
    { _id: id, isActive: true },
    {
      $set: {
        name: body.name,
        permissions: body.permissions,
      },
    },
    { runValidators: true, projection: '_id' }
  );

  if (!data) return next(new AppError(constants.ID_NOT_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, { prefix: 'Role' });
});

validation.deleteRole = validator(deleteRoleValidation);
export const deleteRole = catchAsync(async (req, res, next) => {
  const { params } = req;
  const { id } = params;

  const query = { role: id, isDeleted: false };
  const [userCheck, adminCheck] = await Promise.all([User.exists(query), Admin.exists(query)]);

  if (userCheck ?? adminCheck) {
    return next(new AppError(constants.ROLE_DELETE_NOT_ALLOWED, constants.BAD_REQUEST));
  }

  const data = await Role.findOneAndDelete({ _id: id });
  if (!data) return next(new AppError(constants.ID_NOT_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, { prefix: 'Role' });
});
