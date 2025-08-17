
import { Router } from "express"
import { authenticator } from "otplib"
import { eq } from "drizzle-orm"
import { db } from "../db"
import { users } from "../db/schema"
import { requireAuth } from "../middleware/rbac"
import { randomBytes } from "crypto"

const router = Router()

router.post("/enroll-2fa", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.id
    const secret = authenticator.generateSecret()
    const service = "VictorySync"
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    
    if (!user.length) {
      return res.status(404).json({ error: "User not found" })
    }

    const otpauth = authenticator.keyuri(user[0].email, service, secret)
    
    res.json({
      base32: secret,
      otpauth,
      qr: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth)}`
    })
  } catch (error) {
    console.error("MFA enrollment error:", error)
    res.status(500).json({ error: "MFA enrollment failed" })
  }
})

router.post("/enable-2fa", requireAuth, async (req, res) => {
  try {
    const { base32, totp } = req.body
    const userId = (req as any).user.id

    const isValid = authenticator.verify({ token: totp, secret: base32 })
    if (!isValid) {
      return res.status(400).json({ error: "Invalid TOTP code" })
    }

    // Generate backup codes
    const backupCodes = Array.from({ length: 8 }, () => randomBytes(4).toString("hex"))
    
    await db.update(users)
      .set({
        mfaEnabled: true,
        mfaSecret: base32,
        mfaBackupCodes: backupCodes
      })
      .where(eq(users.id, userId))

    res.json({ ok: true, backupCodes })
  } catch (error) {
    console.error("MFA enable error:", error)
    res.status(500).json({ error: "Failed to enable MFA" })
  }
})

router.post("/disable-2fa", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.id
    
    await db.update(users)
      .set({
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: null
      })
      .where(eq(users.id, userId))

    res.json({ ok: true })
  } catch (error) {
    console.error("MFA disable error:", error)
    res.status(500).json({ error: "Failed to disable MFA" })
  }
})

router.post("/challenge-2fa", async (req, res) => {
  try {
    const { totp, backupCode, userId } = req.body

    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    if (!user.length || !user[0].mfaEnabled) {
      return res.status(400).json({ error: "MFA not enabled" })
    }

    let isValid = false

    if (totp && user[0].mfaSecret) {
      isValid = authenticator.verify({ token: totp, secret: user[0].mfaSecret })
    } else if (backupCode && user[0].mfaBackupCodes) {
      const codes = user[0].mfaBackupCodes as string[]
      isValid = codes.includes(backupCode)
      
      if (isValid) {
        // Remove used backup code
        const updatedCodes = codes.filter(code => code !== backupCode)
        await db.update(users)
          .set({ mfaBackupCodes: updatedCodes })
          .where(eq(users.id, userId))
      }
    }

    res.json({ valid: isValid })
  } catch (error) {
    console.error("MFA challenge error:", error)
    res.status(500).json({ error: "MFA challenge failed" })
  }
})

export default router
