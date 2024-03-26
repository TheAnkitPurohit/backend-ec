import type { AggregatePaginateModel, Model } from 'mongoose';

export interface GroupSchema {
  name: string;
  enabled: boolean;
}

type Group = AggregatePaginateModel<GroupSchema>;

export type GroupCoreModel = Model<GroupSchema>;

export type GroupModel = GroupCoreModel & Group;
