import categoryFields from '@/models/category/fields';
import groupFields from '@/models/group/fields';
import { adminFields, profileFields, userFields } from '@/models/user/fields';

const fields = {
  PROFILE: profileFields,
  ADMIN_PROFILE: adminFields,
  USER: userFields,
  CATEGORY: categoryFields,
  GROUP: groupFields,

  pagination: {
    limit: true,
    page: true,
    totalDocs: true,
    totalPages: true,
  },
};

export default fields;
