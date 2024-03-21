import type { PlatformType, PlatformTypeLabel } from '@/types/constants.types';
import type { ENext, EPartialReq, ERes } from '@/types/express.types';

const getType = (type: PlatformTypeLabel): PlatformType | null => {
  switch (type) {
    case 'CMS':
      return 1;
    case 'FRONT':
      return 2;
    default:
      return null;
  }
};

const identifyType =
  (type: PlatformTypeLabel) =>
  (req: EPartialReq, res: ERes, next: ENext): void => {
    const myType = getType(type);

    req.isCMS = type === 'CMS';
    if (myType) req.userType = myType;
    next();
  };

export default identifyType;
