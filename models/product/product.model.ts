import { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

import config from '@/config';
import { schemaOptions } from '@/models/shared/schema';

import type { ProductCoreModel, ProductModel, ProductSchema } from '@/models/product/product.types';

const productSchema = new Schema<ProductSchema, ProductCoreModel>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    product_number: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    weight: {
      type: Number,
      trim: true,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    arraival_date: {
      type: Date,
    },
    is_free_delivery: {
      type: Boolean,
      default: false,
    },
    tax: {
      type: Number,
      default: config.DEFAULT_TAX,
    },
    status: {
      type: String,
      enum: config.PRODUCT_STATUS,
      default: config.PRODUCT_STATUS[1],
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

productSchema.plugin(aggregatePaginate);

const Admin = model<ProductSchema, ProductModel>('Product', productSchema, 'products');

export default Admin;
