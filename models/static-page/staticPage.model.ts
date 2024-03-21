import { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

import { schemaOptions } from '@/models/shared/schema';

import type {
  StaticPageCoreModel,
  StaticPageModel,
  StaticPageSchema,
} from '@/models/static-page/staticPage.types';

const staticPageSchema = new Schema<StaticPageSchema, StaticPageCoreModel>(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  schemaOptions
);

staticPageSchema.plugin(aggregatePaginate);

const StaticPage = model<StaticPageSchema, StaticPageModel>(
  'StaticPage',
  staticPageSchema,
  'static_pages'
);

export default StaticPage;
