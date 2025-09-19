
import { Router } from "express";
import { db } from "../db";
import { entitlements } from "@shared/schema";
import { and, eq } from "drizzle-orm";

const router = Router();

async function hasEmailSupport(orgId: string) {
  const rows = await db.select().from(entitlements)
    .where(and(eq(entitlements.orgId, orgId), eq(entitlements.featureId, "email_support"))).limit(1);
  return rows.length && rows[0].enabled === true;
}

router.post("/inbound-email", async (req, res) => {
  // Normalize provider payload to { orgId, from, subject, text }
  const { orgId, from, subject, text } = req.body;
  if (!await hasEmailSupport(orgId)) return res.status(403).json({ error: "Email support not in plan" });

  // TODO: insert ticket, push to queue, emit event
  // await db.insert(tickets) ...
  res.json({ ok: true });
});

export default router;
