import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID || 'praiseimpact-fed2b';

// Initialize Firebase Admin
// Note: In production, you should provide service account credentials
// via GOOGLE_APPLICATION_CREDENTIALS env var or by passing them to cert()
if (!admin.apps.length) {
  admin.initializeApp({
    projectId,
  });
}

export const auth = admin.auth();
