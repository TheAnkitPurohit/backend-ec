import type {
  CommonUserStaticsArg,
  ComparePassword,
  GetUserPipeline,
  UserExtendedSchema,
} from '@/models/user/shared/common.types';
import type { EmailLogSchema } from '@/models/user/user.types';
import type { AggregateType, NonNullish } from '@/types/common.types';
import type { AggregatePaginateModel, Model, Types } from 'mongoose';

export interface AdminSchema {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile?: string | null;
  countryCode?: string | null;
  countryIsoCode?: string | null;
  emailLog: EmailLogSchema[];
  avatar?: string | null;
  role: Types.ObjectId;
  fcm?: string | null;
  isActive?: boolean;
  isDeleted?: boolean;
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
