import crypto from 'crypto';

import constants from '@/constants/constants';
import sendRes from '@/helpers/fn.controller';
import Admin from '@/models/user/admin/admin.model';
import { createAdminValidation } from '@/models/user/admin/validation';
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
  const verificationUrl = `${req.protocol}://${req.get('host')}/verify-email/${token}`;

  console.log({ verificationUrl });

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

export const list = catchAsync(async (req, res) => {
  const data = await Admin.find(
    { isDeleted: false, isMainAdmin: false },
    {
      isDeleted: 0,
      isEmailVerified: 0,
      isMainAdmin: 0,
      updatedAt: 0,
    }
  );

  return sendRes(data, constants.SUCCESS, req, res, {
    message: constants.DATA_RETRIEVED('Admin'),
    showData: true,
    showEmpty: true,
  });
});
