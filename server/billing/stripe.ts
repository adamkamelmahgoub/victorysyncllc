
import { db } from "../db";
import { entitlements } from "../../shared/schema";
import { eq, and } from "drizzle-orm";

export async function applyPlanToOrg(orgId: string, planId: string) {
  const scaleFeatures = [
    'priority_support',
    'dedicated_manager',
    'custom_integrations',
    'advanced_analytics',
    'white_label_branding',
    '24_7_availability',
    'custom_workflows',
    'api_access',
    'advanced_reporting',
    'multi_user_access',
    'custom_domains'
  ];

  if (planId === 'scale') {
    for (const feature of scaleFeatures) {
      await db.insert(entitlements).values({
        orgId,
        featureId: feature,
        enabled: true,
      }).onConflictDoUpdate({
        target: [entitlements.orgId, entitlements.featureId],
        set: { enabled: true }
      });
    }
  }
}
