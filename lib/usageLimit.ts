import { getAdminDb } from "./firebase-admin";

export const WEEKLY_LIMIT = 10;

/** Returns the ISO 8601 week key for a given date, e.g. "2026-W14" */
function getWeekKey(date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

export type UsageResult = {
  allowed: boolean;
  used: number;
  remaining: number;
  limit: number;
};

/**
 * Checks the user's usage for the current week and increments it if under the limit.
 * Returns whether the request is allowed and how many checks remain.
 * If Firebase is not configured, always allows (fail open for unconfigured envs).
 */
export async function checkAndIncrementUsage(userId: string): Promise<UsageResult> {
  const db = getAdminDb();
  if (!db) {
    console.warn("[usageLimit] Firebase not configured — skipping usage check");
    return { allowed: true, used: 0, remaining: WEEKLY_LIMIT, limit: WEEKLY_LIMIT };
  }

  const weekKey = getWeekKey();
  const docRef = db.collection("usageLimits").doc(userId);
  const snap = await docRef.get();

  let used = 0;
  if (snap.exists) {
    const data = snap.data();
    used = data?.weekKey === weekKey ? (data?.count ?? 0) : 0;
  }

  if (used >= WEEKLY_LIMIT) {
    return { allowed: false, used, remaining: 0, limit: WEEKLY_LIMIT };
  }

  const newCount = used + 1;
  await docRef.set({ weekKey, count: newCount, updatedAt: new Date() }, { merge: true });

  return {
    allowed: true,
    used: newCount,
    remaining: WEEKLY_LIMIT - newCount,
    limit: WEEKLY_LIMIT,
  };
}

/** Returns current usage without incrementing. */
export async function getUsage(userId: string): Promise<Omit<UsageResult, "allowed">> {
  const db = getAdminDb();
  if (!db) {
    return { used: 0, remaining: WEEKLY_LIMIT, limit: WEEKLY_LIMIT };
  }

  const weekKey = getWeekKey();
  const docRef = db.collection("usageLimits").doc(userId);
  const snap = await docRef.get();

  if (!snap.exists) return { used: 0, remaining: WEEKLY_LIMIT, limit: WEEKLY_LIMIT };

  const data = snap.data();
  const used = data?.weekKey === weekKey ? (data?.count ?? 0) : 0;
  return { used, remaining: WEEKLY_LIMIT - used, limit: WEEKLY_LIMIT };
}
