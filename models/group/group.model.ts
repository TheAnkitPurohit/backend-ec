import { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

import { schemaOptions } from '@/models/shared/schema';

import type { GroupCoreModel, GroupModel, GroupSchema } from '@/models/group/group.types';

const groupSchema = new Schema<GroupSchema, GroupCoreModel>(
  {
    name: {
      type: String,
    },
    enabled: {
      type: Boolean,
      default: false,
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

groupSchema.plugin(aggregatePaginate);

const Group = model<GroupSchema, GroupModel>('Group', groupSchema, 'groups');

export default Group;
