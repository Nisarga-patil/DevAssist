// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY!,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID!}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID!,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID!}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID!,
  appId: import.meta.env.VITE_FIREBASE_APP_ID!,
});

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});
export default app;
