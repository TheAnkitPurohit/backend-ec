import crypto from 'crypto';

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
  AdminCoreModel,
  AdminCoreStatics,
  AdminMethods,
  AdminModel,
  AdminSchema,
  AdminStatics,
} from '@/models/user/admin/admin.types';
import type { NonNullish } from '@/types/common.types';

const adminSchema = new Schema<
  AdminSchema,
  AdminCoreModel,
  AdminMethods,
  NonNullish,
  NonNullish,
  AdminCoreStatics
>(
  {
    name: {
      type: String,
      trim: true,
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
    },
    refresh_token_id: {
      type: String,
    },
    avatar: {
      type: String,
      trim: true,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: false, // Set default to false as email needs to be verified
    },
    isMainAdmin: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    verifyEmailToken: {
      type: String,
      select: false, // Do not include this field by default
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  schemaOptions
);

adminSchema.plugin(aggregatePaginate);

adminSchema.pre(/^(save|findOneAndUpdate)/, preChangePasswordHook);

adminSchema.pre('aggregate', preAggregateHook);

const getUser: AdminStatics['getUser'] = async function (this: AdminModel, arg) {
  const [data] = await this.aggregate(getUserPipeline(arg));
  return data;
};

adminSchema.method({ comparePassword });

adminSchema.static({ getUserPipeline, getUser });

const Admin = model<AdminSchema, AdminModel>('Admin', adminSchema);

export default Admin;
