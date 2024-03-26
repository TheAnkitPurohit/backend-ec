import constants from '@/constants/constants';
import sendRes from '@/helpers/fn.controller';
import Product from '@/models/product/product.model';
import { createProductValidation } from '@/models/product/validation';
import { AppError, catchAsync } from '@/utils/appError';
import { validator } from '@/utils/helper';

import type { ValidationType } from '@/types/common.types';

export const validation: ValidationType = {};

validation.createProductValidation = validator(createProductValidation);
export const createProduct = catchAsync(async (req, res, next) => {
  const { body } = req;

  const data = await Product.create(body);

  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, {
    message: constants.DATA_CREATED('Product'),
    showData: false,
  });
});
