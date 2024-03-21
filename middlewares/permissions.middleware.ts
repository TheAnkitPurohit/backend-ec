import constants from '@/constants/constants';
import { AppError, catchAsync } from '@/utils/appError';
import { getFullURL } from '@/utils/helper';

import type { EReq } from '@/types/express.types';

const checkPermissions = (req: EReq) => {
  const url = new URL(getFullURL(req));
  const path = `/${url.pathname.split('/').slice(3).join('/')}`;
  const dynamicPath = Object.entries(req.params).reduce(
    (acc, [key, val]) => acc.replace(val, `:${key}`),
    path
  );
  return !req.permissions.find(cur => cur.name === dynamicPath && req.userType === cur.type);
};

// Permissions will only set before controller, so you can get dynamic values
const permissions = catchAsync(async (req, res, next) => {
  if (checkPermissions(req)) {
    return next(new AppError(constants.FORBIDDEN_ERROR, constants.FORBIDDEN));
  }

  return next();
});

export default permissions;
