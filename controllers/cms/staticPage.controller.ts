import constants from '@/constants/constants';
import sendRes from '@/helpers/fn.controller';
import { makeParams } from '@/helpers/pagination.controller';
import StaticPage from '@/models/static-page/staticPage.model';
import {
  createStaticPageValidation,
  deleteStaticPageValidation,
  getAllStaticPagesValidation,
  getStaticPageByIdValidation,
  updateStaticPageValidation,
} from '@/models/static-page/validation';
import { AppError, catchAsync } from '@/utils/appError';
import { validator } from '@/utils/helper';

import type { ValidationType } from '@/types/common.types';

export const validation: ValidationType = {};

validation.createStaticPage = validator(createStaticPageValidation);
export const createStaticPage = catchAsync(async (req, res, next) => {
  const { body } = req;

  const data = await StaticPage.create(body);
  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.CREATED, req, res, { prefix: 'Static Page' });
});

validation.getStaticPage = validator(getStaticPageByIdValidation);
export const getStaticPage = catchAsync(async (req, res, next) => {
  const { params } = req;
  const { id } = params;

  const data = await StaticPage.findOne({ _id: id, isActive: true });
  if (!data) return next(new AppError(constants.ID_NOT_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, { prefix: 'Static Page' });
});

validation.getAllStaticPages = validator(getAllStaticPagesValidation);
export const getAllStaticPages = catchAsync(async (req, res) => {
  const { query, body } = req;
  const { page = 1, limit = constants.PER_PAGE_LIMIT } = query;
  const { pagination = true } = body;

  const params = makeParams({ isActive: true });

  const aggregate = StaticPage.aggregate([...params]);
  const data = await StaticPage.aggregatePaginate(aggregate, {
    page: +page,
    limit: +limit,
    pagination,
  });

  return sendRes(data, constants.SUCCESS, req, res, {
    pagination: true,
    prefix: 'Static Page',
  });
});

validation.updateStaticPage = validator(updateStaticPageValidation);
export const updateStaticPage = catchAsync(async (req, res, next) => {
  const { params, body } = req;
  const { id } = params;

  const data = await StaticPage.findOneAndUpdate(
    { _id: id, isActive: true },
    { $set: body },
    { runValidators: true, projection: '_id' }
  );

  if (!data) return next(new AppError(constants.ID_NOT_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, { prefix: 'Static Page' });
});

validation.deleteStaticPage = validator(deleteStaticPageValidation);
export const deleteStaticPage = catchAsync(async (req, res, next) => {
  const { params } = req;
  const { id } = params;

  const data = await StaticPage.findOneAndDelete({ _id: id });
  if (!data) return next(new AppError(constants.ID_NOT_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, { prefix: 'Static Page' });
});
