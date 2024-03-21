import { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

import { schemaOptions } from '@/models/shared/schema';

import type {
  EmailTemplateCoreModel,
  EmailTemplateModel,
  EmailTemplateSchema,
} from '@/models/email-template/emailTemplate.types';

export const emailTemplateSchema = new Schema<EmailTemplateSchema, EmailTemplateCoreModel>(
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
      lowercase: true,
      trim: true,
      required: true,
    },
    values: {
      type: [String],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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

emailTemplateSchema.index(
  { slug: 1, isDeleted: 1 },
  { unique: true, partialFilterExpression: { isDeleted: { $eq: false } } }
);

emailTemplateSchema.plugin(aggregatePaginate);

const EmailTemplate = model<EmailTemplateSchema, EmailTemplateModel>(
  'EmailTemplate',
  emailTemplateSchema,
  'email_templates'
);

export default EmailTemplate;
