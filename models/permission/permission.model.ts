import { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

import { schemaOptions } from '@/models/shared/schema';

import type {
  PermissionCoreModel,
  PermissionModel,
  PermissionSchema,
} from '@/models/permission/permission.types';

const permissionSchema = new Schema<PermissionSchema, PermissionCoreModel>(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    displayName: {
      type: String,
      trim: true,
      required: true,
    },
    module: {
      type: String,
      trim: true,
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

permissionSchema.index({ name: 1, type: 1 }, { unique: true });

permissionSchema.plugin(aggregatePaginate);

const Permission = model<PermissionSchema, PermissionModel>('Permission', permissionSchema);

export default Permission;
