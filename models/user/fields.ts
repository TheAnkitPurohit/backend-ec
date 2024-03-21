const commonFields = {
  _id: true,
  avatar: true,
  avatarUrl: true,
  countryCode: true,
  countryIsoCode: true,
  email: true,
  fcm: true,
  firstName: true,
  fullName: true,
  isActive: true,
  lastName: true,
  mobile: true,
  permissions: true,
  role: {
    _id: true,
    name: true,
  },
};

export const profileFields = {
  ...commonFields,
  address: true,
  city: true,
  country: true,
  isVerified: true,
  state: true,
  username: true,
  zipcode: true,
};

export const adminFields = {
  ...commonFields,
};

export const userFields = {
  ...profileFields,
  permissions: false,
  role: {
    _id: true,
    name: true,
    type: true,
  },
};
