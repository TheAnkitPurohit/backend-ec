import { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

import { schemaOptions } from '@/models/shared/schema';

import type {
  CategoryCoreModel,
  CategoryModel,
  CategorySchema,
} from '@/models/category/category.types';

const categorySchema = new Schema<CategorySchema, CategoryCoreModel>(
  {
    name: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
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

categorySchema.plugin(aggregatePaginate);

const Category = model<CategorySchema, CategoryModel>('Category', categorySchema, 'categories');

export default Category;
