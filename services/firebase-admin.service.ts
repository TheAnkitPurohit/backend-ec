import admin from 'firebase-admin';

import { client_email, private_key, project_id } from '@/config/firebaseAdminSDK.json';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: project_id,
    privateKey: private_key,
    clientEmail: client_email,
  }),
});

export default admin;
