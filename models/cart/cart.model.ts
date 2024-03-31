import { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

import { schemaOptions } from '@/models/shared/schema';

import type { CartCoreModel, CartModel, CartSchema } from '@/models/cart/cart.types';

const cartSchema = new Schema<CartSchema, CartCoreModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      unique: true,
      required: true,
    },
    items: [
      {
        product_id: {
          type: Schema.Types.ObjectId,
          ref: 'product',
          required: true,
        },
        items: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  schemaOptions
);

cartSchema.plugin(aggregatePaginate);

const Cart = model<CartSchema, CartModel>('Cart', cartSchema, 'carts');

export default Cart;
