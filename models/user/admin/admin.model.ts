import { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

import { schemaOptions } from '@/models/shared/schema';
import {
  comparePassword,
  getUserPipeline,
  preAggregateHook,
  preChangePasswordHook,
} from '@/models/user/shared/common';
import { emailLogSchema } from '@/models/user/user.model';

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
    fcm: {
      type: String,
      trim: true,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
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
