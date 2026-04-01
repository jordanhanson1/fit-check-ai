import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
};

function initializeAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Use Application Default Credentials (ADC) for local dev and Vercel
  // Requires GOOGLE_APPLICATION_CREDENTIALS env var or Vercel Firebase integration
  return initializeApp({
    projectId: firebaseAdminConfig.projectId,
  });
}

let _db: ReturnType<typeof getFirestore> | null = null;

export function getAdminDb() {
  if (!firebaseAdminConfig.projectId) {
    console.warn("[firebase-admin] Firebase not configured");
    return null;
  }

  if (!_db) {
    const app = initializeAdmin();
    _db = getFirestore(app);
  }
  return _db;
}
