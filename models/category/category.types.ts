import type { AggregatePaginateModel, Model } from 'mongoose';

export interface CategorySchema {
  name: string;
  order: number;
  enabled: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  deletedBy: string | null;
}

type Category = AggregatePaginateModel<CategorySchema>;

export type CategoryCoreModel = Model<CategorySchema>;

export type CategoryModel = CategoryCoreModel & Category;
