import { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

import { schemaOptions } from '@/models/shared/schema';

import type { GroupCoreModel, GroupModel, GroupSchema } from '@/models/group/group.types';

const groupSchema = new Schema<GroupSchema, GroupCoreModel>(
  {
    name: {
      type: String,
      unique: true,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
  },
  schemaOptions
);

groupSchema.plugin(aggregatePaginate);

const Group = model<GroupSchema, GroupModel>('Group', groupSchema, 'groups');

export default Group;
