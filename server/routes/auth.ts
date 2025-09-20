import { Router } from "express";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import { db } from "../db";
import { publicUsers, entitlements, features, organizations } from "../../shared/schema";
import { eq, and } from "drizzle-orm";
import { toIntId } from "../db/id";

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

  // get/create the org and ensure it's an integer
  const orgIdInt = toIntId(org.id, "org_id");

  // Ensure all features are enabled for this org (covers Scale plan)
  await sql`
    INSERT INTO entitlements (org_id, feature_id, enabled, value)
    SELECT ${orgIdInt}, f.code, TRUE, NULL::text
    FROM features f
    WHERE NOT EXISTS (
      SELECT 1 FROM entitlements e
      WHERE e.org_id = ${orgIdInt} AND e.feature_id = f.code
    )
  `;

  // Always store number in JWT
  const token = jwt.sign(
    { sub: user.id, orgId: orgIdInt, role: user.privileges?.role || 'admin' },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" }
  );

  // Set cookie with proper configuration for Replit iframe environment
  const isProduction = process.env.NODE_ENV === "production";
  res.setHeader("Set-Cookie", cookie.serialize("vs_session", token, {
    httpOnly: true,
    secure: isProduction, // true in production for HTTPS
    sameSite: isProduction ? "none" : "lax", // 'none' for iframe, 'lax' for local dev
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  }));
  res.json({ ok: true, orgId: orgIdInt, plan: 'scale' });
});

authRouter.post("/logout", async (_req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.setHeader("Set-Cookie", cookie.serialize("vs_session", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 0, // Expire immediately
  }));
  res.json({ ok: true });
});

authRouter.get("/me", async (req, res) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.vs_session;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    }

    if (!token) {
      return res.status(401).json({ ok: false, user: null });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    res.status(200).json({ 
      ok: true, 
      user: {
        id: decoded.sub,
        orgId: decoded.orgId, 
        role: decoded.role || 'admin'
      }
    });
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(401).json({ ok: false, user: null });
  }
});

authRouter.get("/session", async (req, res) => {
  const a = (req as any).auth;
  res.json({ authenticated: !!a, orgId: a?.orgId ?? null, userId: a?.userId ?? null });
});