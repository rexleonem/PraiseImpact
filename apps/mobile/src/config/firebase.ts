import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  Auth,
} from 'firebase/auth';
// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Guard against missing environment variables (common in misconfigured production builds)
if (!firebaseConfig.apiKey || !firebaseConfig.appId) {
  console.error(
    '[Firebase] CRITICAL: Missing required environment variables. ' +
    'Check EXPO_PUBLIC_FIREBASE_API_KEY and EXPO_PUBLIC_FIREBASE_APP_ID in eas.json.'
  );
}

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
  try {
    // For native, use initializeAuth with React Native persistence.
    // getReactNativePersistence is correctly imported from firebase/auth for v10+
    const persistence = getReactNativePersistence(AsyncStorage);
    auth = initializeAuth(app, {
      persistence,
    });
  } catch (e) {
    console.error('[Firebase] initializeAuth failed, falling back to getAuth:', e);
    // Fallback to getAuth which might use in-memory persistence or fail gracefully
    auth = getAuth(app);
  }
}

// Configure Google Sign-in
if (Platform.OS !== 'web' && GoogleSignin) {
  try {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
  } catch (e) {
    console.warn('Google Sign-in configuration failed:', e);
  }
}

export { auth, GoogleSignin };
