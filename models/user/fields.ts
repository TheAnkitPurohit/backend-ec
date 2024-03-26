const commonFields = {
  _id: true,
  avatar: true,
  avatarUrl: true,
  email: true,
  firstName: true,
  fullName: true,
  isActive: true,
  lastName: true,
};

export const profileFields = {
  ...commonFields,
  countryCode: true,
  countryIsoCode: true,
  address: true,
  city: true,
  country: true,
  isVerified: true,
  state: true,
  username: true,
  zipcode: true,
  mobile: true,
};

export const adminFields = {
  ...commonFields,
};

export const userFields = {
  ...profileFields,
};
