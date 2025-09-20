
import { db } from "../db/client";
import { entitlements } from "../db/schema";
import { and, eq } from "drizzle-orm";

export async function requireFeature(orgId: string, featureId: string) {
  const rows = await db.select().from(entitlements)
    .where(and(eq(entitlements.orgId, orgId), eq(entitlements.featureId, featureId))).limit(1);
  if (!rows.length || rows[0].enabled !== true) {
    const e = new Error(`Feature ${featureId} not enabled for this plan`);
    (e as any).status = 403;
    throw e;
  }
  return rows[0].value ?? {};
}
