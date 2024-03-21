import constants from '@/constants/constants';
import sendRes from '@/helpers/fn.controller';
import { makeParams, makeSearchParams, makeSortParams } from '@/helpers/pagination.controller';
import EmailTemplate from '@/models/email-template/emailTemplate.model';
import {
  createEmailTemplateValidation,
  getAllEmailTemplatesValidation,
  getEmailTemplateByIdValidation,
  softDeleteEmailTemplateValidation,
  updateEmailTemplateValidation,
} from '@/models/email-template/validation';
import { AppError, catchAsync } from '@/utils/appError';
import { validator } from '@/utils/helper';

import type { ValidationType } from '@/types/common.types';

export const validation: ValidationType = {};

validation.createEmailTemplate = validator(createEmailTemplateValidation);
export const createEmailTemplate = catchAsync(async (req, res, next) => {
  const { body } = req;

  const data = await EmailTemplate.create(body);
  if (!data) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.CREATED, req, res, { prefix: 'Email Template' });
});

validation.getEmailTemplate = validator(getEmailTemplateByIdValidation);
export const getEmailTemplate = catchAsync(async (req, res, next) => {
  const { params } = req;
  const { id } = params;

  const data = await EmailTemplate.findOne({ _id: id, isActive: true });
  if (!data) return next(new AppError(constants.ID_NOT_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, { prefix: 'Email Template' });
});

validation.getAllEmailTemplates = validator(getAllEmailTemplatesValidation);
export const getAllEmailTemplates = catchAsync(async (req, res) => {
  const { query, body } = req;
  const { page = 1, limit = constants.PER_PAGE_LIMIT } = query;
  const { search, fields, sort, sortBy, pagination = true, isActive = undefined } = body;

  const params = makeParams({ isActive, isDeleted: false });

  const searchParams = () => makeSearchParams(search, fields);

  const sortParams = () => makeSortParams(sort, sortBy);

  const aggregate = EmailTemplate.aggregate([
    ...params,
    { $match: searchParams() },
    { $sort: sortParams() },
  ]);

  const data = await EmailTemplate.aggregatePaginate(aggregate, {
    page: +page,
    limit: +limit,
    pagination,
  });

  return sendRes(data, constants.SUCCESS, req, res, {
    pagination: true,
    prefix: 'Email Template',
  });
});

validation.updateEmailTemplate = validator(updateEmailTemplateValidation);
export const updateEmailTemplate = catchAsync(async (req, res, next) => {
  const { body, params } = req;
  const { id } = params;

  const data = await EmailTemplate.findOneAndUpdate(
    { _id: id, isActive: true },
    { $set: body },
    { runValidators: true, projection: '_id' }
  );

  if (!data) return next(new AppError(constants.ID_NOT_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, { prefix: 'Email Template' });
});

validation.softDeleteEmailTemplate = validator(softDeleteEmailTemplateValidation);
export const softDeleteEmailTemplate = catchAsync(async (req, res, next) => {
  const { params, user } = req;
  const { id } = params;

  const data = await EmailTemplate.findOneAndUpdate(
    { _id: id, isActive: true },
    {
      $set: { isActive: false, isDeleted: true, deletedAt: new Date(), deletedBy: user._id },
    },
    { runValidators: true, projection: '_id' }
  );

  if (!data) return next(new AppError(constants.ID_NOT_FOUND, constants.BAD_REQUEST));

  return sendRes(data, constants.SUCCESS, req, res, { prefix: 'Email Template' });
});
