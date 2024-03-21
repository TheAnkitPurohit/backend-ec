import constants from '@/constants/constants';
import Settings from '@/models/settings/settings.model';
import { AppError } from '@/utils/appError';

import type { ENext, EPartialReq, ERes } from '@/types/express.types';

const maintenanceMode = async (req: EPartialReq, res: ERes, next: ENext): Promise<void> => {
  const settings = await Settings.findOne({ type: 'default' }).select('isSiteInMaintenance');

  if (!settings || settings.isSiteInMaintenance) {
    return void next(new AppError(constants.MAINTENANCE_ERROR, constants.SERVICE_UNAVAILABLE));
  }

  next();
};

export default maintenanceMode;
