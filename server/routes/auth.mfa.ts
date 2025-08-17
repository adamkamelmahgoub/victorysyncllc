
import { Router } from "express";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";
import type express from "express";
import { eq, and, isNull } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { encrypt, decrypt } from "../lib/crypto";

// MFA backup codes table schema
const mfaBackupCodes = {
  id: "id",
  userId: "user_id", 
  codeHash: "code_hash",
  usedAt: "used_at",
  createdAt: "created_at"
};

async function dbGetUserById(userId: number) {
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return user[0] || null;
}

async function dbSetUserMfaSecret(userId: number, secretEncrypted: string) {
  await db.update(users)
    .set({ mfaSecret: secretEncrypted })
    .where(eq(users.id, userId));
}

async function dbSetUserMfaEnabled(userId: number, enabled: boolean) {
  await db.update(users)
    .set({ mfaEnabled: enabled })
    .where(eq(users.id, userId));
}

async function dbInsertBackupCodes(userId: number, codeHashes: string[]) {
  // Insert backup codes using raw SQL since we don't have the schema defined in Drizzle yet
  for (const hash of codeHashes) {
    await db.execute(`INSERT INTO mfa_backup_codes(user_id, code_hash) VALUES (${userId}, '${hash}')`);
  }
}

async function dbFindAndConsumeBackupCode(userId: number, plaintext: string): Promise<boolean> {
  // Find unused backup codes for this user
  const codes = await db.execute(`SELECT id, code_hash FROM mfa_backup_codes WHERE user_id = ${userId} AND used_at IS NULL`);
  
  for (const code of codes as any[]) {
    const isValid = await bcrypt.compare(plaintext, code.code_hash);
    if (isValid) {
      // Mark as used
      await db.execute(`UPDATE mfa_backup_codes SET used_at = now() WHERE id = ${code.id}`);
      return true;
    }
  }
  
  return false;
}

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user: any = (req as any).user;
  if (!user?.id) return res.status(401).json({ error: "unauthorized" });
  next();
}

const router = Router();

// TOTP settings
authenticator.options = {
  window: 1, // allow small clock drift
};

// POST /api/auth/mfa/enroll
// Returns: { otpauthUrl, qrDataUrl } and stores encrypted secret for the user
router.post("/api/auth/mfa/enroll", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user as { id: number; email: string };
    if (!user?.id || !user?.email) return res.status(400).json({ error: "user_missing" });

    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.email, "VictorySync", secret);
    const qrDataUrl = await QRCode.toDataURL(otpauth);

    const secretEncrypted = encrypt(secret);
    await dbSetUserMfaSecret(user.id, secretEncrypted);

    return res.status(200).json({ otpauthUrl: otpauth, qrDataUrl });
  } catch (err) {
    console.error("MFA enroll error:", err);
    return res.status(500).json({ error: "mfa_enroll_failed" });
  }
});

// POST /api/auth/mfa/enable { totp }
// Verifies token against stored encrypted secret, enables MFA, and emits 10 one-time backup codes.
router.post("/api/auth/mfa/enable", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user as { id: number };
    const { totp } = req.body ?? {};
    if (!totp) return res.status(400).json({ error: "totp_required" });

    const u = await dbGetUserById(user.id);
    if (!u?.mfaSecret) return res.status(400).json({ error: "mfa_not_enrolled" });

    const secret = decrypt(u.mfaSecret);
    const valid = authenticator.verify({ token: totp, secret });
    if (!valid) return res.status(400).json({ error: "invalid_totp" });

    // Generate 10 backup codes (groups of 4-4-4 digits)
    const codesPlain: string[] = Array.from({ length: 10 }, () =>
      Array.from({ length: 3 }, () => Math.floor(1000 + Math.random() * 9000).toString()).join("-")
    );

    const codeHashes = await Promise.all(codesPlain.map((c) => bcrypt.hash(c, 10)));
    await dbInsertBackupCodes(user.id, codeHashes);

    await dbSetUserMfaEnabled(user.id, true);

    // Show the codes ONCE; client should prompt user to save them
    return res.status(200).json({ backupCodes: codesPlain });
  } catch (err) {
    console.error("MFA enable error:", err);
    return res.status(500).json({ error: "mfa_enable_failed" });
  }
});

// POST /api/auth/mfa/disable
router.post("/api/auth/mfa/disable", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user as { id: number };
    await dbSetUserMfaEnabled(user.id, false);
    // Optionally: wipe secret and remaining backup codes
    await db.update(users)
      .set({ mfaSecret: null })
      .where(eq(users.id, user.id));
    await db.execute(`DELETE FROM mfa_backup_codes WHERE user_id = ${user.id} AND used_at IS NULL`);
    return res.status(204).send();
  } catch (err) {
    console.error("MFA disable error:", err);
    return res.status(500).json({ error: "mfa_disable_failed" });
  }
});

// POST /api/auth/mfa/challenge { totp? , backupCode? }
// Used during login if MFA is enabled.
router.post("/api/auth/mfa/challenge", async (req, res) => {
  try {
    const { userId, totp, backupCode } = req.body ?? {};
    if (!userId) return res.status(400).json({ error: "user_required" });

    const u = await dbGetUserById(Number(userId));
    if (!u?.mfaEnabled || !u?.mfaSecret) {
      return res.status(400).json({ error: "mfa_not_enabled" });
    }

    const secret = decrypt(u.mfaSecret);

    if (typeof totp === "string" && totp.length > 0) {
      const valid = authenticator.verify({ token: totp, secret });
      return valid ? res.status(204).send() : res.status(400).json({ error: "invalid_totp" });
    }

    if (typeof backupCode === "string" && backupCode.length > 0) {
      const ok = await dbFindAndConsumeBackupCode(u.id, backupCode);
      return ok ? res.status(204).send() : res.status(400).json({ error: "invalid_backup_code" });
    }

    return res.status(400).json({ error: "totp_or_backup_code_required" });
  } catch (err) {
    console.error("MFA challenge error:", err);
    return res.status(500).json({ error: "mfa_challenge_failed" });
  }
});

export default router;
