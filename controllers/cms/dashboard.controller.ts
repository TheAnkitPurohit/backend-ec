import constants from '@/constants/constants';
import sendRes from '@/helpers/fn.controller';
import User from '@/models/user/user.model';
import { catchAsync } from '@/utils/appError';

export const getDashboardLists = catchAsync(async (req, res) => {
  const usersCount = await User.countDocuments();

  const data = { usersCount };

  return sendRes(data, constants.SUCCESS, req, res);
});
