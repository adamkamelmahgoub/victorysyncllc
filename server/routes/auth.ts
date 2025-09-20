import { Router } from "express";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { users, organizations } from "../../shared/schema";
import { eq, sql as drizzleSql } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  // Check public_users table for authentication
  const publicUser = await sql`SELECT * FROM public_users WHERE email = ${email} LIMIT 1`;
  if (!publicUser.length) return res.status(401).json({ error: "Invalid credentials" });
  
  const user = publicUser[0];
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  // For public_users, get org from the demo org we created (using numeric ID only)
  const orgResult = await sql`SELECT * FROM organizations WHERE name = 'VictorySync Demo (Scale)' LIMIT 1`;
  const org = orgResult[0];
  
  if (!org) return res.status(500).json({ error: "Demo organization not found" });

  // Ensure all features are enabled for this org (covers Scale plan)
  await sql`
    INSERT INTO entitlements (org_id, feature_id, enabled, value)
    SELECT ${org.id}, f.id, TRUE, NULL::text
    FROM features f
    WHERE NOT EXISTS (
      SELECT 1 FROM entitlements e
      WHERE e.org_id = ${org.id} AND e.feature_id = f.id
    )
  `;

  // Generate token
  const token = jwt.sign(
    { sub: user.id, orgId: org.id, role: user.privileges?.role || 'admin' },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" }
  );

  res.setHeader("Set-Cookie", cookie.serialize("vs_token", token, {
    httpOnly: true, sameSite: "lax", path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
  }));
  res.json({ ok: true, orgId: org.id, plan: 'scale' });
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