import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import config from '@/config';
import constants from '@/constants/constants';
import { Roles } from '@/constants/json';
import sendRes from '@/helpers/fn.controller';
import { deleteUploadedFile } from '@/helpers/image.controller';
import Admin from '@/models/user/admin/admin.model';
import {
  generateTokenValidation,
  loginValidation,
  resetPasswordValidation,
  verifyEmailValidation,
} from '@/models/user/admin/validation';
import { AppError, catchAsync } from '@/utils/appError';
import { validator } from '@/utils/helper';

import type { ValidationType } from '@/types/common.types';

export const validation: ValidationType = {};

validation.login = validator(loginValidation);
export const login = catchAsync(async (req, res, next) => {
  const { body, userType } = req;
  const { email, password } = body;

  const isAdmin = Roles.isAdmin(userType);
  if (!isAdmin) {
    return next(
      new AppError(constants.NOT_VERIFIED, constants.UNAUTHORIZED, {
        isVerified: false,
      })
    );
  }

  const admin = await Admin.findOne({ email, isDeleted: false }).select('+password');
  if (!admin) return next(new AppError(constants.INCORRECT_LOGIN, constants.UNAUTHORIZED));

  const checkPass = await admin.comparePassword(password, admin.password);
  if (!checkPass) return next(new AppError(constants.INCORRECT_LOGIN, constants.UNAUTHORIZED));

  if (!admin.isActive) {
    return next(
      new AppError(constants.NOT_ACTIVATED, constants.UNAUTHORIZED, {
        isActive: false,
      })
    );
  }

  const uuid = uuidv4();

  // if accessToken Id then only single device login

  const accessToken = jwt.sign({ _id: admin._id }, config.ADMIN_JWT_SECRET, {
    expiresIn: '30m',
  });

  const refreshToken = jwt.sign({ _id: admin._id, uuid }, config.ADMIN_JWT_SECRET_REF, {
    expiresIn: '8h',
  });

  admin.refresh_token_id = uuid;
  await admin.save();

  return sendRes(
    {
      _id: admin._id,
      accessToken,
      refreshToken,
    },
    constants.SUCCESS,
    req,
    res,
    {
      message: constants.LOGIN_MESSAGE,
      showData: true,
    }
  );
});

validation.verifyEmailValidation = validator(verifyEmailValidation);
export const verifyEmail = catchAsync(async (req, res, next) => {
  const { params, userType } = req;
  const { token } = params;

  const isAdmin = Roles.isAdmin(userType);
  if (!isAdmin) {
    return next(
      new AppError(constants.NOT_VERIFIED, constants.UNAUTHORIZED, {
        isVerified: false,
      })
    );
  }

  const admin = await Admin.findOne({
    verifyEmailToken: token,
    isDeleted: false,
    isEmailVerified: false,
  });
  if (!admin) {
    return next(new AppError(constants.INVALID_TOKEN_ERROR, constants.BAD_REQUEST));
  }

  admin.isEmailVerified = true;
  await admin.save();

  return sendRes(
    {
      _id: admin._id,
    },
    constants.SUCCESS,
    req,
    res,
    {
      message: constants.TOKEN_VERIFIED,
    }
  );
});

validation.resetPasswordValidation = validator(resetPasswordValidation);
export const resetPassword = catchAsync(async (req, res, next) => {
  const { userType, body } = req;
  const { password, token } = body;

  const isAdmin = Roles.isAdmin(userType);
  if (!isAdmin) {
    if (req.file) {
      deleteUploadedFile(req.file.filename);
    }
    return next(
      new AppError(constants.NOT_VERIFIED, constants.UNAUTHORIZED, {
        isVerified: false,
      })
    );
  }

  const admin = await Admin.findOne({
    verifyEmailToken: token,
    isDeleted: false,
    isEmailVerified: true,
  });

  if (!admin) {
    if (req.file) {
      deleteUploadedFile(req.file.filename);
    }
    return next(new AppError(constants.NO_DATA_FOUND, constants.BAD_REQUEST));
  }

  admin.password = password;
  admin.isActive = true;

  if (admin.avatar && req.file) {
    deleteUploadedFile(admin.avatar);
  }

  if (req.file) {
    admin.avatar = req.file.filename;
  }

  // admin.verifyEmailToken = undefined
  await admin.save();

  return sendRes(
    {
      _id: admin._id,
    },
    constants.SUCCESS,
    req,
    res,
    {
      message: constants.RESET_PASSWORD_MESSAGE,
    }
  );
});

validation.generateTokenValidation = validator(generateTokenValidation);
export const generateToken = catchAsync(async (req, res, next) => {
  const { userType, body } = req;
  const { refreshTokenAdmin } = body;

  const isAdmin = Roles.isAdmin(userType);
  if (!isAdmin) {
    return next(
      new AppError(constants.NOT_VERIFIED, constants.UNAUTHORIZED, {
        isVerified: false,
      })
    );
  }

  const tokenInfo = await jwt.verify(refreshTokenAdmin, config.ADMIN_JWT_SECRET_REF);

  if (!tokenInfo || tokenInfo === '')
    return next(new AppError(constants.TOKEN_NOT_EXIST_ERROR, constants.UNAUTHORIZED));

  if (!(tokenInfo instanceof Object) || !('_id' in tokenInfo))
    return next(new AppError(constants.TOKEN_NOT_EXIST_ERROR, constants.UNAUTHORIZED));

  if (!tokenInfo._id)
    return next(new AppError(constants.TOKEN_NOT_EXIST_ERROR, constants.UNAUTHORIZED));

  const admin = await Admin.findOne({
    _id: tokenInfo._id,
  });

  if (!admin) return next(new AppError(constants.TOKEN_NOT_EXIST_ERROR, constants.UNAUTHORIZED));

  if (admin.refresh_token_id !== tokenInfo.uuid)
    return next(new AppError(constants.TOKEN_NOT_EXIST_ERROR, constants.UNAUTHORIZED));

  if (!admin.isActive) {
    return next(
      new AppError(constants.NOT_ACTIVATED, constants.UNAUTHORIZED, {
        isActive: false,
      })
    );
  }

  const uuid = uuidv4();

  // if accessToken Id then only single device login
  const accessToken = jwt.sign({ _id: admin._id }, config.ADMIN_JWT_SECRET, {
    expiresIn: '30m',
  });

  const refreshToken = jwt.sign({ _id: admin._id, uuid }, config.ADMIN_JWT_SECRET_REF, {
    expiresIn: '8h',
  });

  admin.refresh_token_id = uuid;
  await admin.save();

  return sendRes(
    {
      _id: admin._id,
      accessToken,
      refreshToken,
    },
    constants.SUCCESS,
    req,
    res,
    {
      message: constants.RESET_PASSWORD_MESSAGE,
      showData: true,
    }
  );
});
