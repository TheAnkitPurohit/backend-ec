import { Roles } from '@/constants/json';
import Admin from '@/models/user/admin/admin.model';
import User from '@/models/user/user.model';

import type { GetModel } from '@/models/user/shared/common.types';
import type { PlatformType } from '@/types/constants.types';

const getUserOrAdminModel = <M extends PlatformType>(userType: M): GetModel<M> => {
  const isAdmin = Roles.isAdmin(userType);
  return isAdmin ? Admin : User;
};

export default getUserOrAdminModel;
