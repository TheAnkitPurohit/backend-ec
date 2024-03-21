import admin from '@/services/firebase-admin.service';

import type { SendFCMNotification } from '@/types/services/notification.types';

export const sendFCMNotification: SendFCMNotification = async ({ token, notification, data }) => {
  try {
    return await admin.messaging().send({
      token,
      notification,
      data,
    });
  } catch (e) {
    return false;
  }
};
