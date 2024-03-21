import type { EmailSlug } from '@/types/services/email.types';
import type { AggregatePaginateModel, Document, Model, Types } from 'mongoose';

export interface EmailTemplateSchema extends Document {
  title: string;
  description: string;
  slug: EmailSlug;
  values: string[];
  isActive?: boolean;
  isDeleted?: boolean;
  deletedAt?: Date | null;
  deletedBy?: Types.ObjectId | null;
}

type EmailTemplateStatics = AggregatePaginateModel<EmailTemplateSchema>;

export type EmailTemplateCoreModel = Model<EmailTemplateSchema>;

export type EmailTemplateModel = EmailTemplateCoreModel & EmailTemplateStatics;
