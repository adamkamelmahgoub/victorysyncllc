
import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import argon2 from "argon2";
import { db } from "../db/client.js";
import { sql } from "drizzle-orm";

const r = Router();

const forgotSchema = z.object({
  email: z.string().email(),
  role: z.enum(["customer","admin"]),
});

const resetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
  role: z.enum(["customer","admin"]),
});

function devLogResetLink(link: string) {
  console.log("🔐 Password reset link:", link);
}

r.post("/auth/forgot", async (req, res) => {
  const parse = forgotSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid" });
  const { email, role } = parse.data;

  try {
    // Look up user
    const users = await db.execute(sql`
      SELECT id,email FROM users WHERE email = ${email} AND role = ${role === "admin" ? "admin" : "customer"}
    `);
    
    // Respond 200 even if not found (privacy)
    if (!users.rows.length) return res.json({ ok: true });
    
    const user = users.rows[0];
    const raw = `${user.id}.${Date.now()}.${Math.random().toString(36).slice(2)}`;
    const tokenHash = await bcrypt.hash(raw, 10);
    
    await db.execute(sql`
      INSERT INTO password_resets (user_id, token_hash, role)
      VALUES (${user.id}, ${tokenHash}, ${role})
    `);

    const token = Buffer.from(raw).toString("base64url");
    const base = process.env.PUBLIC_URL || "";
    const link = role === "admin"
      ? `${base}/admin/reset-password/${token}`
      : `${base}/reset-password/${token}`;

    // Dev: Show in logs
    devLogResetLink(link);

    res.json({ ok: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

r.post("/auth/reset", async (req, res) => {
  const parse = resetSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid" });
  const { token, password, role } = parse.data;

  try {
    let raw: string;
    try {
      raw = Buffer.from(token, "base64url").toString();
    } catch {
      return res.status(400).json({ error: "Invalid token" });
    }

    const userIdStr = raw.split(".")[0];
    const userId = Number(userIdStr);
    if (!userId) return res.status(400).json({ error: "Invalid token" });

    // Validate token
    const prResults = await db.execute(sql`
      SELECT id, token_hash, used_at, created_at
      FROM password_resets
      WHERE user_id = ${userId} AND role = ${role}
      ORDER BY created_at DESC
      LIMIT 1
    `);
    
    if (!prResults.rows.length) return res.status(400).json({ error: "Token expired" });
    
    const pr = prResults.rows[0];
    if (pr.used_at) return res.status(400).json({ error: "Token expired" });
    
    const ok = await bcrypt.compare(raw, pr.token_hash);
    if (!ok) return res.status(400).json({ error: "Bad token" });

    const hash = await argon2.hash(password);
    
    // Update password and mark token as used
    await db.execute(sql`UPDATE users SET password_hash = ${hash} WHERE id = ${userId}`);
    await db.execute(sql`UPDATE password_resets SET used_at = NOW() WHERE id = ${pr.id}`);

    res.json({ ok: true });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default r;
