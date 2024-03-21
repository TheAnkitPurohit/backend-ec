import jwt from 'jsonwebtoken';

import config from '@/config';
import constants from '@/constants/constants';
import { Roles } from '@/constants/json';
import Admin from '@/models/user/admin/admin.model';
import User from '@/models/user/user.model';
import { AppError, catchAsync, isAppError } from '@/utils/appError';
import { decrypt, generateSecret } from '@/utils/security';

import type { JWTPayload } from '@/types/middlewares.types';

const { TOKEN_HEADER_NAME } = config;

// Protect middleware that helps to protect protected-routes
const protect = catchAsync(async (req, res, next) => {
  const { userType } = req;

  const Model = Roles.isAdmin(userType) ? Admin : User;
  const secret = generateSecret(userType);
  const headerToken = req.headers[TOKEN_HEADER_NAME] as string | undefined;

  const token = headerToken?.startsWith('Bearer') ? headerToken.split(' ')[1] : undefined;
  if (!token) return next(new AppError(constants.UNAUTHORIZED_ERROR, constants.UNAUTHORIZED));

  const decryptedToken = decrypt(
    token,
    () => new AppError(constants.INVALID_TOKEN_ERROR, constants.UNAUTHORIZED)
  );

  if (isAppError(decryptedToken)) return next(decryptedToken);

  const decoded = jwt.verify(decryptedToken, secret) as JWTPayload;

  // GRANT ACCESS TO PROTECTED ROUTE & PASS THIS TO NEXT MIDDLEWARE
  const user = await Model.getUser({ id: decoded._id, isPermissionsRequired: true });
  if (!user) return next(new AppError(constants.TOKEN_NOT_EXIST_ERROR, constants.UNAUTHORIZED));
  if (!user.isActive) return next(new AppError(constants.NOT_ACTIVATED, constants.UNAUTHORIZED));

  req.user = { _id: user._id };
  req.permissions = user.permissions;
  return next();
});

export default protect;
