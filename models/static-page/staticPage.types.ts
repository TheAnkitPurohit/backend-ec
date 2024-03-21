import type { AggregatePaginateModel, Model } from 'mongoose';

export interface StaticPageSchema {
  title: string;
  description: string;
  slug: string;
  isActive?: boolean;
}

type StaticPageStatics = AggregatePaginateModel<StaticPageSchema>;

export type StaticPageCoreModel = Model<StaticPageSchema>;

export type StaticPageModel = StaticPageCoreModel & StaticPageStatics;
