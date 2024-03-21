import type { PlatformType } from '@/types/constants.types';
import type { AggregatePaginateModel, Model } from 'mongoose';

export interface PermissionSchema {
  name: string;
  displayName: string;
  module: string;
  type: PlatformType;
  isActive?: boolean;
}

type PermissionStatics = AggregatePaginateModel<PermissionSchema>;

export type PermissionCoreModel = Model<PermissionSchema>;

export type PermissionModel = PermissionCoreModel & PermissionStatics;
