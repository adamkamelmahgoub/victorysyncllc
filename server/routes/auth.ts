
import { Router } from "express";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { users, organizations } from "../../shared/schema";
import { eq } from "drizzle-orm";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const org = await db.query.organizations.findFirst({ where: eq(organizations.id, user.orgId) });
  const token = jwt.sign({ sub: user.id, orgId: user.orgId, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "24h" });

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
