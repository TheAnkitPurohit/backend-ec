import emailTemplateFields from '@/models/email-template/fields';
import permissionFields from '@/models/permission/fields';
import roleFields from '@/models/role/fields';
import staticPageFields from '@/models/static-page/fields';
import { adminFields, profileFields, userFields } from '@/models/user/fields';

const fields = {
  EMAIL_TEMPLATE: emailTemplateFields,
  PERMISSION: permissionFields,
  PROFILE: profileFields,
  ADMIN_PROFILE: adminFields,
  ROLE: roleFields,
  STATIC_PAGE: staticPageFields,
  USER: userFields,
  pagination: {
    limit: true,
    page: true,
    totalDocs: true,
    totalPages: true,
  },
};

export default fields;
