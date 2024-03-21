import { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

import { schemaOptions } from '@/models/shared/schema';

import type {
  RoleCoreModel,
  RoleCoreStatics,
  RoleModel,
  RoleSchema,
  RoleStatics,
} from '@/models/role/role.types';
import type { NonNullish } from '@/types/common.types';

export const roleSchema = new Schema<
  RoleSchema,
  RoleCoreModel,
  NonNullish,
  NonNullish,
  NonNullish,
  RoleCoreStatics
>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    permissions: {
      type: [Schema.Types.ObjectId],
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  schemaOptions
);

roleSchema.index({ name: 1, type: 1 }, { unique: true });

roleSchema.plugin(aggregatePaginate);

const getRole: RoleStatics['getRole'] = ({ id }) => [
  {
    $match: id
      ? {
          $expr: {
            $eq: ['$_id', { $toObjectId: id }],
          },
        }
      : {},
  },
  {
    $lookup: {
      from: 'permissions',
      localField: 'permissions',
      foreignField: '_id',
      as: 'permissions',
    },
  },
  {
    $addFields: {
      id: '$_id',
      permissions: {
        $filter: {
          input: '$permissions',
          as: 'permission',
          cond: {
            $and: [
              { $eq: ['$$permission.type', '$type'] },
              { $eq: ['$$permission.isActive', true] },
            ],
          },
        },
      },
    },
  },
];

roleSchema.static({ getRole });

const Role = model<RoleSchema, RoleModel>('Role', roleSchema);

export default Role;
