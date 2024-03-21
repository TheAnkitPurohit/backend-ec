import type { PlatformType } from '@/types/constants.types';
import type { AggregatePaginateModel, Model, PipelineStage, Types } from 'mongoose';

export interface RoleSchema {
  name: string;
  permissions: Types.ObjectId[];
  type: PlatformType;
  isActive?: boolean;
}

interface GetRoleArg {
  id: string | null;
}

export interface RoleCoreStatics {
  getRole: (arg: GetRoleArg) => PipelineStage[];
}

export type RoleStatics = RoleCoreStatics & AggregatePaginateModel<RoleSchema>;

export type RoleCoreModel = Model<RoleSchema>;

export type RoleModel = RoleCoreModel & RoleStatics;
