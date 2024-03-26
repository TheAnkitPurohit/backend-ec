import type { AggregatePaginateModel, Model } from 'mongoose';

export interface CategorySchema {
  name: string;
  enabled: boolean;
}

type Category = AggregatePaginateModel<CategorySchema>;

export type CategoryCoreModel = Model<CategorySchema>;

export type CategoryModel = CategoryCoreModel & Category;
