import categoryFields from '@/models/category/fields';
import groupFields from '@/models/group/fields';
import productFields from '@/models/product/fields';
import subAdminFields from '@/models/user/admin/fields';
import { adminFields, profileFields, userFields } from '@/models/user/fields';

const fields = {
  PROFILE: profileFields,
  ADMIN_PROFILE: adminFields,
  USER: userFields,
  CATEGORY: categoryFields,
  GROUP: groupFields,
  PRODUCT: productFields,
  ADMIN: subAdminFields,

  pagination: {
    limit: true,
    page: true,
    totalDocs: true,
    totalPages: true,
  },
};

export default fields;
