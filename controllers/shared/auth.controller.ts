import constants from '@/constants/constants';
import { Roles } from '@/constants/json';
import sendEmail, { getDecryptedEmailToken, verifyEmailLog } from '@/helpers/email.controller';
import sendRes from '@/helpers/fn.controller';
import Role from '@/models/role/role.model';
import getUserOrAdminModel from '@/models/user/model';
import User from '@/models/user/user.model';
import {
  forgotPasswordValidation,
  loginValidation,
  resendVerificationLinkValidation,
  resetPasswordValidation,
  signupValidation,
  verifyUserValidation,
} from '@/models/user/validation';
import { s3UploadSignedUrl } from '@/services/aws.service';
import { AppError, catchAsync, isAppError } from '@/utils/appError';
import { toObjectId, validator } from '@/utils/helper';

import type { ValidationType } from '@/types/common.types';

export const validation: ValidationType = {};

validation.signup = validator(signupValidation);
export const signup = catchAsync(async (req, res, next) => {
  const { body, userType } = req;

  const userCheck = await User.exists({ email: body.email, isActive: true });
  if (userCheck) return next(new AppError(constants.USER_ALREADY_EXIST, constants.BAD_REQUEST));

  const role = await Role.exists({ _id: body.role, isActive: true, type: userType });
  if (!role) return next(new AppError(constants.INVALID_ROLE, constants.BAD_REQUEST));

  const upload = await s3UploadSignedUrl({ name: body.avatar }, 'users');
  if (!upload) return next(new AppError(constants.S3_ERROR, constants.SERVER_ERROR));

  const user = await User.create({ ...body, avatar: upload.path });
  if (!user) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  const isSent = await sendEmail(
    { _id: user._id, userType },
    {
      slug: 'welcome',
      email: {
        to: user.email,
        extra: {
          fullName: `${user.firstName} ${user.lastName}`,
        },
      },
    }
  );

  if (isAppError(isSent)) return next(isSent);

  return sendRes({ _id: user._id, uploadDetails: upload }, constants.SUCCESS, req, res, {
    token: true,
    message: constants.REGISTER_MESSAGE,
    showData: true,
  });
});

validation.login = validator(loginValidation);
export const login = catchAsync(async (req, res, next) => {
  const { body, userType } = req;
  const { email, password } = body;

  const isAdmin = Roles.isAdmin(userType);
  const Model = getUserOrAdminModel(userType);

  const user = await Model.findOne({ email, isDeleted: false }).select('+password');
  if (!user) return next(new AppError(constants.INCORRECT_LOGIN, constants.UNAUTHORIZED));

  const checkPass = await user.comparePassword(password, user.password);
  if (!checkPass) return next(new AppError(constants.INCORRECT_LOGIN, constants.UNAUTHORIZED));

  if (!user.isActive) {
    return next(
      new AppError(constants.NOT_ACTIVATED, constants.UNAUTHORIZED, {
        isActive: false,
      })
    );
  }

  if (!isAdmin && !user.isVerified) {
    return next(
      new AppError(constants.NOT_VERIFIED, constants.UNAUTHORIZED, {
        isVerified: false,
      })
    );
  }

  return sendRes(user, constants.SUCCESS, req, res, {
    message: constants.LOGIN_MESSAGE,
    token: true,
  });
});

validation.forgotPassword = validator(forgotPasswordValidation);
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { body, userType } = req;
  const { email } = body;

  const Model = getUserOrAdminModel(userType);

  const user = await Model.findOne({ email, isActive: true }).select('firstName lastName email');
  if (!user) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  const isSent = await sendEmail(
    { _id: user._id, userType },
    {
      slug: 'reset-password',
      email: {
        to: user.email,
        extra: {
          fullName: `${user.firstName} ${user.lastName}`,
        },
      },
    }
  );

  if (isAppError(isSent)) return next(isSent);

  return sendRes(user, constants.SUCCESS, req, res, {
    message: constants.FORGOT_PASSWORD_MESSAGE,
  });
});

validation.resetPassword = validator(resetPasswordValidation);
export const resetPassword = catchAsync(async (req, res, next) => {
  const { params, body, userType } = req;
  const { token: encryptedToken } = params;
  const { password } = body;

  const slug = 'reset-password';
  const Model = getUserOrAdminModel(userType);

  const decryptedEmailToken = getDecryptedEmailToken(encryptedToken);
  if (isAppError(decryptedEmailToken)) return next(decryptedEmailToken);

  const { id, token } = decryptedEmailToken;

  const user = await Model.findOne({ _id: id, isActive: true }).select('+password');
  if (!user) return next(new AppError(constants.EXPIRED_TOKEN_ERROR, constants.UNAUTHORIZED));

  const checkPass = await user.comparePassword(password, user.password);
  if (checkPass) return next(new AppError(constants.SAME_PASSWORD, constants.UNAUTHORIZED));

  const isSent = await verifyEmailLog(userType, { id: toObjectId(id), slug, token });
  if (isAppError(isSent)) return next(isSent);

  await Model.findOneAndUpdate(
    { _id: id, isActive: true },
    {
      $set: { password },
    },
    { runValidators: true, projection: '_id' }
  );

  return sendRes(user, constants.SUCCESS, req, res, {
    message: constants.RESET_PASSWORD_MESSAGE,
  });
});

validation.resendVerificationLink = validator(resendVerificationLinkValidation);
export const resendVerificationLink = catchAsync(async (req, res, next) => {
  const { body, userType } = req;
  const { email } = body;

  const user = await User.findOne({ email, isActive: true }).select(
    'firstName lastName email isVerified'
  );
  if (!user) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));
  if (user.isVerified) return next(new AppError(constants.ALREADY_VERIFIED, constants.BAD_REQUEST));

  const isSent = await sendEmail(
    { _id: user._id, userType },
    {
      slug: 'welcome',
      email: {
        to: user.email,
        extra: {
          fullName: `${user.firstName} ${user.lastName}`,
        },
      },
    }
  );

  if (isAppError(isSent)) return next(isSent);

  return sendRes(user, constants.SUCCESS, req, res, {
    message: constants.VERIFICATION_MAIL_SENT_MESSAGE,
  });
});

validation.verifyUser = validator(verifyUserValidation);
export const verifyUser = catchAsync(async (req, res, next) => {
  const { params, userType } = req;
  const { token: encryptedToken } = params;
  const slug = 'welcome';

  const decryptedEmailToken = getDecryptedEmailToken(encryptedToken);
  if (isAppError(decryptedEmailToken)) return next(decryptedEmailToken);

  const { id, token } = decryptedEmailToken;
  const isVerified = await User.exists({ _id: id, isActive: true, isVerified: true });

  const isSent = await verifyEmailLog(userType, {
    id: toObjectId(id),
    slug,
    token,
    resetEverySlugEntries: isVerified ? constants.ALREADY_VERIFIED() : false,
  });

  if (isAppError(isSent)) return next(isSent);

  const user = await User.findOneAndUpdate(
    { _id: id, isActive: true },
    {
      $set: { isVerified: true },
    },
    { runValidators: true, projection: '_id' }
  );

  if (!user) return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));

  return sendRes(user, constants.SUCCESS, req, res, {
    message: constants.ACCOUNT_VERIFIED_MESSAGE,
  });
});
