import constants from '@/constants/constants';
import sendRes from '@/helpers/fn.controller';
import Category from '@/models/category/category.model';
import {
  createCategoryValidation,
  getCategoryValidation,
  updateCategoryValidation,
} from '@/models/category/validation';
import { AppError, catchAsync } from '@/utils/appError';
import { validator } from '@/utils/helper';

import type { ValidationType } from '@/types/common.types';

export const validation: ValidationType = {};

validation.createCategoryValidation = validator(createCategoryValidation);
export const createCategory = catchAsync(async (req, res, next) => {
  const { body } = req;

  const data = await Category.create(body);

  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, {
    message: constants.DATA_CREATED('Category'),
    showData: false,
  });
});

export const getAllCategory = catchAsync(async (req, res, next) => {
  const data = await Category.find();

  console.log({ data });

  return sendRes(data, constants.SUCCESS, req, res, {
    message: constants.DATA_RETRIEVED('Category'),
    showData: true,
    showEmpty: true,
  });
});

validation.getCategoryValidation = validator(getCategoryValidation);
export const getCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = await Category.findOne({ _id: id });

  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, {
    message: constants.DATA_RETRIEVED('Category'),
  });
});

validation.updateCategoryValidation = validator(updateCategoryValidation);
export const updateCategory = catchAsync(async (req, res, next) => {
  const { body } = req;

  const { id } = req.params;

  const data = await Category.findOneAndUpdate(
    { _id: id },
    { $set: body },
    { runValidators: true, projection: '_id' }
  );
  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, {
    message: constants.DATA_UPDATED('Category'),
  });
});
