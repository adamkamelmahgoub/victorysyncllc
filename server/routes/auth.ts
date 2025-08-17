
import { Router } from "express"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { db } from "../db"
import { users, organizations, accessCodes, otps } from "../db/schema"
import { signJwt } from "../lib/jwt"
import { requireAuth } from "../middleware/rbac"

const router = Router()

router.post("/register", async (req, res) => {
  try {
    const { email, phone, name, organizationNumber, accessCode, password } = req.body

    // Validate access code
    const code = await db.select().from(accessCodes).where(eq(accessCodes.code, accessCode)).limit(1)
    if (!code.length || code[0].usesRemaining <= 0 || code[0].expiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid or expired access code" })
    }

    // Validate scope if specified
    const ac = code[0]
    if (ac.email && ac.email !== email) {
      return res.status(400).json({ error: "Email does not match access code scope" })
    }
    if (ac.phone && ac.phone !== phone) {
      return res.status(400).json({ error: "Phone does not match access code scope" })
    }

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (existingUser.length) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Create organization if needed
    let orgId: number
    if (organizationNumber) {
      const org = await db.insert(organizations).values({
        name: name || email.split("@")[0]
      }).returning()
      orgId = org[0].id
    } else {
      orgId = 1 // Default org
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUser = await db.insert(users).values({
      email,
      phone,
      name,
      password: hashedPassword,
      role: "user",
      orgId,
      emailVerified: !process.env.EMAIL_VERIFICATION,
      phoneVerified: !process.env.EMAIL_VERIFICATION
    }).returning()

    // Decrement access code uses
    await db.update(accessCodes)
      .set({ usesRemaining: ac.usesRemaining - 1 })
      .where(eq(accessCodes.id, ac.id))

    // If email verification required, send OTPs
    if (process.env.EMAIL_VERIFICATION === "true") {
      // TODO: Send email and SMS OTPs
      return res.json({ message: "Registration successful. Please verify your email and phone." })
    }

    const token = signJwt({ sub: newUser[0].id, orgId, role: newUser[0].role })
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
    res.json({ user: { id: newUser[0].id, email: newUser[0].email, role: newUser[0].role } })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Registration failed" })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (!user.length || !user[0].active) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const validPassword = await bcrypt.compare(password, user[0].password || "")
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    if (!user[0].emailVerified && process.env.EMAIL_VERIFICATION === "true") {
      return res.status(401).json({ error: "Email not verified" })
    }

    const token = signJwt({ sub: user[0].id, orgId: user[0].orgId, role: user[0].role })
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
    res.json({ user: { id: user[0].id, email: user[0].email, role: user[0].role } })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Login failed" })
  }
})

router.post("/logout", (req, res) => {
  res.clearCookie("token")
  res.json({ message: "Logged out" })
})

router.get("/me", requireAuth, async (req, res) => {
  const userId = (req as any).user.id
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  if (!user.length) {
    return res.status(404).json({ error: "User not found" })
  }
  res.json({ user: { id: user[0].id, email: user[0].email, role: user[0].role, orgId: user[0].orgId } })
})

router.post("/otp/send", async (req, res) => {
  // TODO: Implement OTP sending
  res.json({ message: "OTP sent" })
})

router.post("/otp/verify", async (req, res) => {
  // TODO: Implement OTP verification
  res.json({ message: "OTP verified" })
})

export default router
import { Express, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@victorysync.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "victorysync2025";

function sign(user: { id: string; email: string; role: "superAdmin" | "admin" }) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "12h" });
}

export function registerAuthRoutes(app: Express) {
  // POST /api/auth/login  -> { token, user }
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body ?? {};
      if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "Invalid payload" });
      }

      // MVP admin login (no DB): compare to env credentials
      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const user = { id: "1", email: ADMIN_EMAIL, role: "superAdmin" as const };
      const token = sign(user);
      return res.json({ token, user });
    } catch (err) {
      return res.status(500).json({ error: "Login failed" });
    }
  });

  // GET /api/auth/me -> { user } (validate token from Authorization: Bearer <token>)
  app.get("/api/auth/me", (req: Request, res: Response) => {
    try {
      const auth = req.header("authorization") || "";
      const [, raw] = auth.split(" ");
      if (!raw) return res.status(401).json({ error: "Missing token" });

      const user = jwt.verify(raw, JWT_SECRET);
      return res.json({ user });
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }
  });
}
