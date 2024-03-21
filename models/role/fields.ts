import permissionsSchema from '@/models/permission/fields';

const roleFields = {
  _id: true,
  createdAt: true,
  isActive: true,
  name: true,
  permissions: {
    ...permissionsSchema,
    type: false,
  },
  type: true,
  updatedAt: true,
};

export default roleFields;
