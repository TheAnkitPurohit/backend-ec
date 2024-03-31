import type { UserSchema } from '@/models/user/user.types';
import type { AggregatePaginateModel, Model } from 'mongoose';

export interface CartSchema {
  user: UserSchema;
  items: [];
}

type Cart = AggregatePaginateModel<CartSchema>;

export type CartCoreModel = Model<CartSchema>;

export type CartModel = CartCoreModel & Cart;
