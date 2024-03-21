import type { messaging } from 'firebase-admin';

export type SendFCMNotificationParams = Pick<
  messaging.TokenMessage,
  'token' | 'notification' | 'data'
>;

export type SendFCMNotification = (arg: SendFCMNotificationParams) => Promise<string | boolean>;
