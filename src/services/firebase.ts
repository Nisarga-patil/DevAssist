import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: `${import.meta.env?.VITE_FIREBASE_PROJECT_ID || 'demo-project'}.firebaseapp.com`,
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: `${import.meta.env?.VITE_FIREBASE_PROJECT_ID || 'demo-project'}.appspot.com`,
  messagingSenderId: '123456789',
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || 'demo-app-id',
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with long-polling to avoid WebChannel 400 errors
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,  // disables streaming support
});

export default app;
