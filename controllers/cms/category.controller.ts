import constants from '@/constants/constants';
import sendRes from '@/helpers/fn.controller';
import Category from '@/models/category/category.model';
import {
  createCategoryValidation,
  deleteCategoryValidation,
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

  const category = await Category.find({ name: body.name, isDeleted: false });

  if (category.length > 0)
    return next(new AppError(constants.ALREADY_EXISTS('Category'), constants.BAD_REQUEST));

  const data = await Category.create(body);

  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, {
    message: constants.DATA_CREATED('Category'),
    showData: false,
  });
});

export const getAllCategory = catchAsync(async (req, res) => {
  const data = await Category.find({ isDeleted: false }, { _id: 1, name: 1, enabled: 1 });

  return sendRes(data, constants.SUCCESS, req, res, {
    message: constants.DATA_RETRIEVED('Category'),
    showData: true,
    showEmpty: true,
  });
});

validation.getCategoryValidation = validator(getCategoryValidation);
export const getCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = await Category.findOne(
    { _id: id, isDeleted: false, enabled: true },
    { _id: 1, name: 1, enabled: 1 }
  );

  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, {
    message: constants.DATA_RETRIEVED('Category'),
  });
});

validation.updateCategoryValidation = validator(updateCategoryValidation);
export const updateCategory = catchAsync(async (req, res, next) => {
  const { body } = req;

  const { id } = req.params;

  // Check if a category with the given _id exists
  const existingCategory = await Category.findOne({ _id: id, isDeleted: false });

  if (!existingCategory) {
    return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));
  }

  if (body.name) {
    // Check if a category with the given name exists and is not deleted
    const duplicateCategory = await Category.findOne({ name: body.name, isDeleted: false });

    if (duplicateCategory && duplicateCategory._id.toString() !== id) {
      return next(new AppError(constants.ALREADY_EXISTS('Category'), constants.BAD_REQUEST));
    }
  }

  // Update the existing category
  const updatedCategory = await Category.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: body },
    { runValidators: true, new: true }
  );

  if (!updatedCategory) {
    return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));
  }

  return sendRes(updatedCategory, constants.SUCCESS, req, res, {
    message: constants.DATA_UPDATED('Category'),
  });
});

validation.deleteCategoryValidation = validator(deleteCategoryValidation);
export const deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params; // Retrieve id from req.params
  const adminId = req.user._id; // Retrieve adminId from req.user

  // Check if a category with the given _id exists and is not deleted
  const existingCategory = await Category.findOne({ _id: id, isDeleted: false });

  if (!existingCategory) {
    return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));
  }

  // Update the category with the deletion details
  const updatedCategory = await Category.findOneAndUpdate(
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

  if (!updatedCategory) {
    return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));
  }

  return sendRes(updatedCategory, constants.SUCCESS, req, res, {
    message: constants.DATA_DELETED('Category'),
  });
});
