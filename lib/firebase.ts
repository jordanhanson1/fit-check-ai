import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  appId: process.env.FIREBASE_APP_ID,
};

function isConfigured() {
  return !!(firebaseConfig.apiKey && firebaseConfig.projectId);
}

let _db: ReturnType<typeof getFirestore> | null = null;

export function getDb() {
  if (!isConfigured()) return null;
  if (!_db) {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    _db = getFirestore(app);
  }
  return _db;
}
