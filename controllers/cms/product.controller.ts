import constants from '@/constants/constants';
import sendRes from '@/helpers/fn.controller';
import { makeDateParams } from '@/helpers/pagination.controller';
import Product from '@/models/product/product.model';
import {
  createProductValidation,
  getAllProductValidation,
  getProductValidation,
  updateProductValidation,
} from '@/models/product/validation';
import { AppError, catchAsync } from '@/utils/appError';
import { validator } from '@/utils/helper';

import type { ValidationType } from '@/types/common.types';

export const validation: ValidationType = {};

validation.createProductValidation = validator(createProductValidation);
export const createProduct = catchAsync(async (req, res, next) => {
  const { body } = req;

  const product = await Product.find({ name: body.name, isDeleted: false });

  if (product.length > 0)
    return next(new AppError(constants.ALREADY_EXISTS('Product'), constants.BAD_REQUEST));

  const data = await Product.create(body);

  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, {
    message: constants.DATA_CREATED('Product'),
    showData: false,
  });
});

validation.getAllProductValidation = validator(getAllProductValidation);
export const getAllProducts = catchAsync(async (req, res) => {
  const {
    name,
    order,
    enabled,
    createdFrom,
    createdTo,
    page = 1,
    limit = constants.PER_PAGE_LIMIT,
  } = req.query;

  const aggregate = Product.aggregate();
  const dateField = 'createdAt';

  if (name) {
    aggregate.match({ name: { $regex: name, $options: 'i' } });
  }

  if (order) {
    aggregate.match({ order: Number(order) });
  }

  if (
    createdFrom &&
    createdTo &&
    typeof createdFrom === 'string' &&
    typeof createdTo === 'string'
  ) {
    aggregate.match(makeDateParams(dateField, createdFrom, createdTo));
  }

  if (enabled !== undefined && typeof enabled === 'string') {
    const isEnabled = enabled.toLowerCase() === 'true';
    aggregate.match({ enabled: isEnabled });
  }

  const data = await Product.aggregatePaginate(aggregate, {
    page: +page,
    limit: +limit,
    pagination: true,
  });

  return sendRes(data, constants.SUCCESS, req, res, {
    pagination: true,
    prefix: 'Product',
  });
});

validation.getProductValidation = validator(getProductValidation);
export const getProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = await Product.findOne(
    { _id: id, isDeleted: false, enabled: true },
    { _id: 1, name: 1, enabled: 1 }
  );

  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, {
    message: constants.DATA_RETRIEVED('Product'),
  });
});

validation.updateProductValidation = validator(updateProductValidation);
export const updateProduct = catchAsync(async (req, res, next) => {
  const { body } = req;

  const { id } = req.params;

  // Check if a product with the given _id exists
  const existingProduct = await Product.findOne({ _id: id, isDeleted: false });

  if (!existingProduct) {
    return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));
  }

  if (body.name) {
    // Check if a product with the given name exists and is not deleted
    const duplicateProduct = await Product.findOne({ name: body.name, isDeleted: false });

    if (duplicateProduct && duplicateProduct._id.toString() !== id) {
      return next(new AppError(constants.ALREADY_EXISTS('Product'), constants.BAD_REQUEST));
    }
  }

  // Update the existing product
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: body },
    { runValidators: true, new: true }
  );

  if (!updatedProduct) {
    return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));
  }

  return sendRes(updatedProduct, constants.SUCCESS, req, res, {
    message: constants.DATA_UPDATED('Product'),
  });
});
