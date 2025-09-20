
import { db } from "./client";
import { features, plans, planFeatures } from "./schema";
import { eq } from "drizzle-orm";

const F = {
  dedicated_agent: "1 Dedicated Agent",
  second_agent: "2 Dedicated Agents",
  business_hours: "Business Hours Support",
  extended_hours: "Extended Hours Support",
  crm_basic: "Basic CRM Integration",
  crm_advanced: "Advanced CRM Integration (2-way)",
  email_support: "Email Support",
  appointments: "Appointment Setting",
  live_chat: "Live Chat Support",
  reports_monthly: "Monthly Reports",
  reports_weekly: "Weekly Reports",
  blended_24x7: "24/7 Blended Team",
  ai_suite: "AI Automation Suite",
  success_manager: "Dedicated Success Manager",
  custom_integrations: "Custom Integrations",
  priority_support: "Priority Support",
  realtime_analytics: "Real-time Analytics"
};

const STARTER = ["dedicated_agent","business_hours","crm_basic","email_support","reports_monthly"] as const;
const GROWTH  = [...STARTER,"second_agent","extended_hours","appointments","crm_advanced","live_chat","reports_weekly"] as const;
const SCALE   = [...GROWTH,"blended_24x7","ai_suite","success_manager","custom_integrations","priority_support","realtime_analytics"] as const;

async function run() {
  // features
  for (const [id,label] of Object.entries(F)) {
    await db.insert(features).values({ id, label }).onConflictDoNothing();
  }
  // plans
  await db.insert(plans).values(
    { id:"starter", stripePriceId: process.env.STRIPE_PRICE_STARTER ?? null, agentSeats:1, hoursPreset:"business" },
  ).onConflictDoNothing();
  await db.insert(plans).values(
    { id:"growth", stripePriceId: process.env.STRIPE_PRICE_GROWTH ?? null, agentSeats:2, hoursPreset:"extended" },
  ).onConflictDoNothing();
  await db.insert(plans).values(
    { id:"scale", stripePriceId: null, agentSeats:2, hoursPreset:"24x7" },
  ).onConflictDoNothing();

  // helpers
  async function link(planId: "starter"|"growth"|"scale", list: readonly string[]) {
    for (const featureId of list) {
      await db.insert(planFeatures).values({ planId, featureId }).onConflictDoNothing();
    }
  }
  await link("starter", STARTER as unknown as string[]);
  await link("growth", GROWTH as unknown as string[]);
  await link("scale", SCALE as unknown as string[]);
  console.log("Seed complete.");
}
run().then(()=>process.exit(0)).catch(e => { console.error(e); process.exit(1); });
