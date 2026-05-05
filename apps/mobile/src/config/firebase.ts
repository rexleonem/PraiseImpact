import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  // @ts-ignore
  getReactNativePersistence, 
  Auth,
  browserLocalPersistence
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

let auth: Auth;

if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  // For native, we MUST use initializeAuth to set persistence, 
  // but we must also ensure we don't call it if already initialized.
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (e) {
    // If already initialized, just get the existing instance
    auth = getAuth(app);
  }
}

export { auth };
