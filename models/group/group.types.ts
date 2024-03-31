import type { AggregatePaginateModel, Model } from 'mongoose';

export interface GroupSchema {
  name: string;
  enabled: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  deletedBy: string | null;
}

type Group = AggregatePaginateModel<GroupSchema>;

export type GroupCoreModel = Model<GroupSchema>;

export type GroupModel = GroupCoreModel & Group;
