import config from '@/config';
import constants from '@/constants/constants';

import type { EmailArgs } from '@/types/services/email.types';

const { CLIENT_URL } = config;

export const emailProperties = {
  logo: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
  productName: 'OpenXcell',
};

const emailArgs: EmailArgs = {
  welcome: {
    subject: constants.WELCOME_SUBJECT(),
    dynamicValues: ({ token, fullName }) => ({
      ...emailProperties,
      url: `${CLIENT_URL}/verify?token=${token}`,
      fullName,
    }),
  },
  'reset-password': {
    subject: constants.RESET_PASSWORD_SUBJECT(),
    dynamicValues: async ({ token, fullName }) => ({
      ...emailProperties,
      url: `${CLIENT_URL}/reset-password?token=${token}`,
      fullName,
    }),
  },
  'change-password': {
    subject: constants.CHANGE_PASSWORD_SUBJECT(),
  },
};

export default emailArgs;
