import { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

import { schemaOptions } from '@/models/shared/schema';
import {
  comparePassword,
  getUserPipeline,
  preAggregateHook,
  preChangePasswordHook,
} from '@/models/user/shared/common';

import type {
  EmailLogModel,
  EmailLogSchema,
  UserCoreModel,
  UserCoreStatics,
  UserMethods,
  UserModel,
  UserSchema,
  UserStatics,
} from '@/models/user/user.types';
import type { NonNullish } from '@/types/common.types';

export const emailLogSchema = new Schema<EmailLogSchema, EmailLogModel>(
  {
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      trim: true,
      required: true,
    },
    token: {
      type: String,
      trim: true,
      default: null,
    },
    expiresIn: {
      type: Date,
      default: null,
    },
    fulfilledAt: {
      type: Date,
      default: null,
    },
  },
  schemaOptions
);

const userSchema = new Schema<
  UserSchema,
  UserCoreModel,
  UserMethods,
  NonNullish,
  NonNullish,
  UserCoreStatics
>(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      select: false,
      required: true,
    },
    mobile: {
      type: String,
      trim: true,
      default: null,
    },
    countryCode: {
      type: String,
      trim: true,
      default: null,
    },
    countryIsoCode: {
      type: String,
      trim: true,
      default: null,
    },
    emailLog: {
      type: [emailLogSchema],
      select: false,
      required: true,
    },
    avatar: {
      type: String,
      trim: true,
      default: null,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    address: {
      type: String,
      trim: true,
      default: null,
    },
    city: {
      type: String,
      trim: true,
      default: null,
    },
    state: {
      type: String,
      trim: true,
      default: null,
    },
    country: {
      type: String,
      trim: true,
      default: null,
    },
    zipcode: {
      type: String,
      trim: true,
      default: null,
    },
    fcm: {
      type: String,
      trim: true,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      select: false,
      default: false,
    },
    deletedAt: {
      type: Date,
      select: false,
      default: null,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      select: false,
      default: null,
    },
  },
  schemaOptions
);

userSchema.plugin(aggregatePaginate);

userSchema.pre(/^(save|findOneAndUpdate)/, preChangePasswordHook);

userSchema.pre('aggregate', preAggregateHook);

const getUser: UserStatics['getUser'] = async function (this: UserModel, arg) {
  const [data] = await this.aggregate(getUserPipeline(arg));
  return data;
};

userSchema.method({ comparePassword });

userSchema.static({ getUserPipeline, getUser });

const User = model<UserSchema, UserModel>('User', userSchema);

export default User;
