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
      unique: true,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
  },
  schemaOptions
);

categorySchema.plugin(aggregatePaginate);

const Category = model<CategorySchema, CategoryModel>('Category', categorySchema, 'categories');

export default Category;
