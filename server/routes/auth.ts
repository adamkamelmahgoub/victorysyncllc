import { Router } from "express";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { users, organizations } from "../../shared/schema";
import { eq, sql } from "drizzle-orm";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const user = await db.query.users.findFirst({ where: eq(users.email, email.toLowerCase().trim()) });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const org = await db.query.organizations.findFirst({ where: eq(organizations.id, user.orgId) });
  // If org is on 'scale', ensure entitlements exist for all plan_features('scale').
  // This is cheap and idempotent: it only inserts missing rows.
  if (org?.planId === 'scale') {
    await db.execute(sql`
      INSERT INTO entitlements (org_id, feature_id, enabled, value)
      SELECT ${user.orgId} AS org_id, pf.feature_id, TRUE AS enabled, NULL::text AS value
      FROM plan_features pf
      WHERE pf.plan_id = 'scale'
        AND NOT EXISTS (
          SELECT 1 FROM entitlements e WHERE e.org_id = ${user.orgId} AND e.feature_id = pf.feature_id
        )
    `);
  }

  // Generate token
  const token = jwt.sign(
    { sub: user.id, orgId: user.orgId, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" }
  );

  res.setHeader("Set-Cookie", cookie.serialize("vs_token", token, {
    httpOnly: true, sameSite: "lax", path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
  }));
  res.json({ ok: true, orgId: user.orgId, plan: org?.planId ?? null });
});

authRouter.post("/logout", async (_req, res) => {
  res.setHeader("Set-Cookie", cookie.serialize("vs_token", "", {
    httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production", maxAge: 0,
  }));
  res.json({ ok: true });
});

authRouter.get("/session", async (req, res) => {
  const a = (req as any).auth;
  res.json({ authenticated: !!a, orgId: a?.orgId ?? null, userId: a?.userId ?? null });
});