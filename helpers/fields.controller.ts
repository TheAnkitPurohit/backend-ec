import emailTemplateFields from '@/models/email-template/fields';
import { adminFields, profileFields, userFields } from '@/models/user/fields';

const fields = {
  EMAIL_TEMPLATE: emailTemplateFields,
  PROFILE: profileFields,
  ADMIN_PROFILE: adminFields,
  USER: userFields,
  pagination: {
    limit: true,
    page: true,
    totalDocs: true,
    totalPages: true,
  },
};

export default fields;
