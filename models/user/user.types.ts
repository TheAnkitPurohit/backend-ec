import type {
  CommonUserStaticsArg,
  ComparePassword,
  GetUserPipeline,
  UserExtendedSchema,
} from '@/models/user/shared/common.types';
import type { AggregateType, NonNullish } from '@/types/common.types';
import type { AggregatePaginateModel, Model, Types } from 'mongoose';

export interface UserSchema {
  firstName: string;
  lastName: string;
  username?: string | null;
  email: string;
  password: string;
  mobile?: string | null;
  countryCode?: string | null;
  countryIsoCode?: string | null;
  avatar?: string | null;
  role: Types.ObjectId;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipcode?: string | null;
  fcm?: string | null;
  isVerified?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  deletedAt?: Date | null;
  deletedBy?: Types.ObjectId | null;
}

export type EntireUserSchema<P> = UserSchema & UserExtendedSchema<P>;

export interface UserMethods {
  comparePassword: ComparePassword;
}

export interface UserCoreStatics {
  getUserPipeline: GetUserPipeline;
  getUser: <P extends boolean>(
    arg: CommonUserStaticsArg<P>
  ) => Promise<AggregateType<EntireUserSchema<P>> | undefined>;
}

export type UserStatics = UserCoreStatics & AggregatePaginateModel<UserSchema>;

export type UserCoreModel = Model<UserSchema, NonNullish, UserMethods>;

export type UserModel = UserCoreModel & UserStatics;
