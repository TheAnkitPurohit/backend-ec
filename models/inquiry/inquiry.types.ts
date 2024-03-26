import type { UserSchema } from '@/models/user/user.types';
import type { AggregatePaginateModel, Model } from 'mongoose';

export interface InquirySchema {
  user: UserSchema;
  name: string;
  email: string;
  title: string;
  content: string;
  memo: string;
  status: string;
}

type Inquiry = AggregatePaginateModel<InquirySchema>;

export type InquiryCoreModel = Model<InquirySchema>;

export type InquiryModel = InquiryCoreModel & Inquiry;
