import * as admin from 'firebase-admin';

// Initialize Firebase Admin with default credentials if available or use a service account key
// In a real production scenario, the service account JSON should be securely loaded.
// For now, we will initialize an empty app to prevent crashes, as we don't have the service account key json yet.
try {
  admin.initializeApp();
} catch (error) {
  console.log('Firebase admin initialization error:', error);
}

export const sendNotification = async (title: string, body: string, topic: string = 'all') => {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      topic,
    };
    
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
