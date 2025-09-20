
import { db } from "../db";
import { organizations, users } from "../../shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { applyPlanToOrg } from "../billing/stripe";

async function run() {
  const orgId = "demo-scale";
  const email = "demo@victorysync.com";
  const password = "VictoryScale!23";

  // Ensure org exists
  const existing = await db.query.organizations.findFirst({ where: eq(organizations.id, orgId) });
  if (!existing) {
    await db.insert(organizations).values({
      id: orgId, 
      name: "VictorySync Demo (Scale)", 
      timezone: "America/New_York", 
      planId: "scale",
    });
    await applyPlanToOrg(orgId, "scale"); // writes all Scale entitlements
    console.log("Created org with Scale plan:", orgId);
  }

  // Upsert user
  const hash = await bcrypt.hash(password, 10);
  // delete + insert keeps things idempotent for the demo
  await db.execute(`delete from users where email = $1`, [email]);
  await db.insert(users).values({
    id: "user-demo-scale",
    email,
    passwordHash: hash,
    orgId,
    role: "demo",
  });
  console.log("✅ Demo user ready:", { email, password });
  process.exit(0);
}
run().catch((e)=>{ console.error(e); process.exit(1); });
