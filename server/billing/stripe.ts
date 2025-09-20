
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
import Stripe from "stripe";
import { db } from "../db/client";
import { organizations, planFeatures, entitlements, plans } from "../db/schema";
import { eq } from "drizzle-orm";

export const stripe = new Stripe(process.env.STRIPE_SECRET!, { apiVersion: "2024-06-20" });

export async function createCheckout(orgId: string, planId: "starter"|"growth"|"scale") {
  const plan = await db.query.plans.findFirst({ where: eq(plans.id, planId) });
  if (!plan) throw new Error("Plan not found");
  if (!plan.stripePriceId) throw new Error("Quote required for Scale");

  const org = await db.query.organizations.findFirst({ where: eq(organizations.id, orgId) });
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: org?.stripeCustomerId || undefined,
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: `${process.env.APP_URL}/billing/success`,
    cancel_url: `${process.env.APP_URL}/pricing`
  });
  return session.url!;
}

export async function applyPlanToOrg(orgId: string, planId: "starter"|"growth"|"scale") {
  // Update org
  await db.update(organizations).set({ planId }).where(eq(organizations.id, orgId));

  // Replace entitlements to exactly match plan
  const links = await db.select().from(planFeatures).where(eq(planFeatures.planId, planId));
  await db.execute(/* sql */`delete from entitlements where org_id = $1`, [orgId]);
  for (const l of links) {
    await db.insert(entitlements).values({ orgId, featureId: l.featureId, enabled: true }).onConflictDoNothing();
  }
}
