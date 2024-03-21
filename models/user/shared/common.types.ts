import type { types } from '@/constants/json';
import type { PermissionSchema } from '@/models/permission/permission.types';
import type { AdminModel } from '@/models/user/admin/admin.types';
import type { UserModel } from '@/models/user/user.types';
import type { IsUnion } from '@/types/common.types';
import type { PipelineStage } from 'mongoose';

export type ComparePassword = (user: string, hash: string) => Promise<boolean>;

export interface CommonUserStaticsArg<P = boolean> {
  id: string | null;
  isPermissionsRequired?: P;
}

export interface UserExtendedSchema<P = false> {
  permissions: P extends true ? PermissionSchema[] : PermissionSchema[] | undefined;
  fullName: string;
  avatarUrl: string | null;
}

export type GetUserPipeline = (arg: CommonUserStaticsArg) => PipelineStage[];

export type GetModel<M> = IsUnion<M> extends true
  ? UserModel
  : M extends typeof types.FRONT
  ? UserModel
  : AdminModel;
