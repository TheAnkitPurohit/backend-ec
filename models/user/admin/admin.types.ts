import type {
  CommonUserStaticsArg,
  ComparePassword,
  GetUserPipeline,
  UserExtendedSchema,
} from '@/models/user/shared/common.types';
import type { AggregateType, NonNullish } from '@/types/common.types';
import type { AggregatePaginateModel, Model } from 'mongoose';

export interface AdminSchema {
  name: string;
  email: string;
  password: string;
  refresh_token_id?: string | null;
  avatar?: string | null;
  isActive?: boolean;
  isDeleted?: boolean;
  isMainAdmin?: boolean;
  verifyEmailToken?: string | null;
  isEmailVerified?: boolean;
}

export type EntireAdminSchema<T> = AdminSchema & UserExtendedSchema<T>;

export interface AdminMethods {
  comparePassword: ComparePassword;
}

export interface AdminCoreStatics {
  getUserPipeline: GetUserPipeline;
  getUser: <P extends boolean>(
    arg: CommonUserStaticsArg<P>
  ) => Promise<AggregateType<EntireAdminSchema<P>> | undefined>;
}

export type AdminStatics = AdminCoreStatics & AggregatePaginateModel<AdminSchema>;

export type AdminCoreModel = Model<AdminSchema, NonNullish, AdminMethods>;

export type AdminModel = AdminCoreModel & AdminStatics;
