import { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

import config from '@/config';
import { schemaOptions } from '@/models/shared/schema';

import type { InquiryCoreModel, InquiryModel, InquirySchema } from '@/models/inquiry/inquiry.types';

const inquirySchema = new Schema<InquirySchema, InquiryCoreModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    memo: {
      type: String,
    },
    status: {
      type: String,
      enum: config.INQUIRY_STATUS,
      default: config.INQUIRY_STATUS[0],
    },
  },
  schemaOptions
);

inquirySchema.plugin(aggregatePaginate);

const Inquiry = model<InquirySchema, InquiryModel>('Inquiry', inquirySchema, 'inquiries');

export default Inquiry;
