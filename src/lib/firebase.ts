// Firebase initialization with hard‑coded config and analytics support
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
};

if (!firebaseConfig.apiKey && typeof window !== 'undefined') {
    console.error("Firebase API Key is missing. Check your environment variables.");
}

const app = initializeApp(firebaseConfig);
// Analytics should only be initialized in the browser environment
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null; // keep null on server
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export { app };
