import crypto from 'crypto';

import constants from '@/constants/constants';
import sendRes from '@/helpers/fn.controller';
import { makeDateParams } from '@/helpers/pagination.controller';
import Admin from '@/models/user/admin/admin.model';
import {
  createAdminValidation,
  deactiveAdminValidation,
  getAllAdminValidation,
} from '@/models/user/admin/validation';
import sendGridMailer from '@/services/email.service';
import { AppError, catchAsync } from '@/utils/appError';
import { validator } from '@/utils/helper';

import type { ValidationType } from '@/types/common.types';

export const validation: ValidationType = {};

validation.create = validator(createAdminValidation);
export const create = catchAsync(async (req, res, next) => {
  const { body } = req;

  const userCheck = await Admin.exists({ email: body.email, isDeleted: false });

  if (userCheck) return next(new AppError(constants.USER_ALREADY_EXIST, constants.BAD_REQUEST));

  // Generate a unique token for email verification
  const token = crypto.randomBytes(32).toString('hex');

  // Create verification URL
  const verificationUrl = `${req.protocol}://${req.get('host')}/set-password/${token}`;

  const message = {
    to: body.email,
    subject: 'Verify your Account',
    text: `Please click on the following link to verify your account: ${verificationUrl}`,
    html: `<strong>Please click on the following link to verify your account:</strong> <a href="${verificationUrl}">${verificationUrl}</a>`,
  };

  try {
    await sendGridMailer.sendEmail(message);
  } catch (error) {
    console.error('Failed to send email:', error);
    return next(new AppError(constants.MAIL_FAILED, constants.BAD_REQUEST));
  }
  // Store the token in the database along with the user's details
  body.verifyEmailToken = token;

  const user = await Admin.create({ ...body });

  if (!user) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes({ _id: user._id }, constants.SUCCESS, req, res, {
    message: constants.REGISTER_MESSAGE,
    showData: true,
  });
});

validation.getAllAdminValidation = validator(getAllAdminValidation);
export const list = catchAsync(async (req, res) => {
  const {
    name,
    status,
    startDate,
    endDate,
    page = 1,
    limit = constants.PER_PAGE_LIMIT,
  } = req.query;

  const aggregate = Admin.aggregate();
  const dateField = 'createdAt';

  aggregate.match({ isDeleted: false, isMainAdmin: false });

  if (name) {
    aggregate.match({ name: { $regex: name, $options: 'i' } });
  }

  if (startDate && endDate && typeof startDate === 'string' && typeof endDate === 'string') {
    aggregate.match(makeDateParams(dateField, startDate, endDate));
  }

  if (status !== undefined && typeof status === 'string') {
    const isEnabled = status.toLowerCase() === 'true';
    aggregate.match({ enabled: isEnabled });
  }

  const data = await Admin.aggregatePaginate(aggregate, {
    page: +page,
    limit: +limit,
    pagination: true,
  });

  return sendRes(data, constants.SUCCESS, req, res, {
    pagination: true,
    prefix: 'Admin',
  });
});

validation.deactiveAdminValidation = validator(deactiveAdminValidation);
export const deActive = catchAsync(async (req, res, next) => {
  const { body } = req;

  const admin = await Admin.findOne({ email: body.email, isDeleted: false, isMainAdmin: false });

  if (!admin) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  admin.isDeleted = true;
  await admin.save();

  return sendRes({ _id: admin._id }, constants.SUCCESS, req, res, {
    message: constants.DATA_DELETED('Admin'),
  });
});
