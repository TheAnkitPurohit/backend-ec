import { types } from '@/constants/json/types';

import type { PlatformType } from '@/types/constants.types';

export class Roles {
  static isAdmin = (type: PlatformType): boolean => type === types.CMS;

  static isFront = (type: PlatformType): boolean => type === types.FRONT;
}
