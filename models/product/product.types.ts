import type { CategorySchema } from '@/models/category/category.types';
import type { GroupSchema } from '@/models/group/group.types';
import type { AdminSchema } from '@/models/user/admin/admin.types';
import type { AggregatePaginateModel, Model } from 'mongoose';

export interface ProductSchema {
  name: string;
  product_number: string;
  weight: number;
  category: CategorySchema;
  group: GroupSchema;
  description: string;
  price: number;
  arraival_date: Date;
  is_free_delivery: boolean;
  tax: number;
  status: string;
  isDeleted: boolean;
  deletedAt: Date;
  deletedBy: AdminSchema;
}

type Product = AggregatePaginateModel<ProductSchema>;

export type ProductCoreModel = Model<ProductSchema>;

export type ProductModel = ProductCoreModel & Product;
