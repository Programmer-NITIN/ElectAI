/**
 * Firebase initialization for ElectAI.
 *
 * Configures Firebase app, Firestore, Auth, and Analytics.
 * Uses environment variables for configuration.
 *
 * @module firebase
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

/** Whether Firebase is configured with valid credentials. */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

/** Firebase app singleton — reuses existing app if already initialized. */
export const app: FirebaseApp | null = isFirebaseConfigured
  ? getApps().length > 0
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;

/** Firestore database instance. */
export const db: Firestore | null = app ? getFirestore(app) : null;

/** Firebase Auth instance. */
export const auth: Auth | null = app ? getAuth(app) : null;

/** Google OAuth provider for sign-in. */
export const googleProvider = new GoogleAuthProvider();

let analyticsInstance: Analytics | null = null;

/**
 * Returns the Firebase Analytics instance, initializing it on first call.
 * @returns Analytics instance or null in SSR
 */
export async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (analyticsInstance) return analyticsInstance;
  if (!app) return null;
  const supported = await isSupported();
  if (supported) analyticsInstance = getAnalytics(app);
  return analyticsInstance;
}
