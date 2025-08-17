
import { Express, Request, Response } from "express";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { z } from "zod";
import { nanoid } from "nanoid";
import { AccessStore, UserStore, ResetStore, User } from "../lib/store";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@victorysync.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "victorysync2025";
const ADMIN_VERIFICATION_PHRASE = process.env.ADMIN_VERIFICATION_PHRASE || "VICTORYSYNC-OWNER";

// seed default admin if not present
async function ensureAdmin() {
  const existing = UserStore.byEmail(ADMIN_EMAIL);
  if (!existing) {
    const hash = await argon2.hash(ADMIN_PASSWORD);
    const admin: User = {
      id: "u_admin",
      email: ADMIN_EMAIL,
      role: "superAdmin",
      passwordHash: hash,
      createdAt: new Date().toISOString()
    };
    UserStore.upsert(admin);
  }
}

// JWT
function sign(user: Pick<User,"id"|"email"|"role">) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "12h" });
}

// helpers
function jsonErr(res: Response, code: number, error: string) {
  return res.status(code).json({ error });
}

export function registerAuthRoutes(app: Express) {
  // Ensure default admin exists
  ensureAdmin().catch(() => {});

  // --- LOGIN ---
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }).parse(req.body);

      const user = UserStore.byEmail(email);
      if (!user) return jsonErr(res, 401, "Invalid email or password");
      const ok = await argon2.verify(user.passwordHash, password);
      if (!ok) return jsonErr(res, 401, "Invalid email or password");

      const token = sign({ id: user.id, email: user.email, role: user.role });
      return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (e:any) {
      return jsonErr(res, 400, e?.message || "Login failed");
    }
  });

  // --- REGISTER with accessCode (or invitation in future) ---
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const body = z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(1),
        org: z.string().min(1).optional(),
        accessCode: z.string().min(4),
      }).parse(req.body);

      // access code validation
      const ac = AccessStore.get(body.accessCode);
      if (!ac || !ac.isActive) return jsonErr(res, 400, "Invalid access code");
      if (ac.email && ac.email.toLowerCase() !== body.email.toLowerCase()) {
        return jsonErr(res, 400, "Access code not issued for this email");
      }
      if (ac.expiresAt && new Date(ac.expiresAt) < new Date()) {
        return jsonErr(res, 400, "Access code expired");
      }
      if (ac.usedCount >= ac.maxUses) {
        return jsonErr(res, 400, "Access code usage limit reached");
      }

      if (UserStore.byEmail(body.email)) return jsonErr(res, 400, "User already exists");
      const hash = await argon2.hash(body.password);
      const u: User = {
        id: `u_${nanoid(10)}`,
        email: body.email,
        role: ac.role || "customer",
        org: body.org || ac.org,
        passwordHash: hash,
        createdAt: new Date().toISOString()
      };
      UserStore.upsert(u);

      // increment use
      ac.usedCount += 1;
      AccessStore.upsert(ac);

      const token = sign({ id: u.id, email: u.email, role: u.role });
      return res.json({ token, user: { id: u.id, email: u.email, role: u.role, org: u.org } });
    } catch (e:any) {
      return jsonErr(res, 400, e?.message || "Registration failed");
    }
  });

  // --- ADMIN: create access code (requires Bearer token of admin) ---
  app.post("/api/access-codes", (req: Request, res: Response) => {
    try {
      // verify bearer token
      const auth = req.header("authorization") || "";
      const [, raw] = auth.split(" ");
      if (!raw) return jsonErr(res, 401, "Missing token");
      const user = jwt.verify(raw, JWT_SECRET) as any;
      if (!user || (user.role !== "admin" && user.role !== "superAdmin")) {
        return jsonErr(res, 403, "Forbidden");
      }

      const body = z.object({
        code: z.string().min(4),
        email: z.string().email().optional(),
        org: z.string().optional(),
        role: z.enum(["superAdmin","admin","manager","agent","customer"]).optional(),
        maxUses: z.number().int().positive().default(1),
        expiresAt: z.string().datetime().optional(),
      }).parse(req.body);

      const record = {
        code: body.code,
        email: body.email,
        org: body.org,
        role: body.role || "customer" as const,
        maxUses: body.maxUses,
        usedCount: 0,
        expiresAt: body.expiresAt,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      AccessStore.upsert(record);
      return res.json({ ok: true, accessCode: record });
    } catch (e:any) {
      return jsonErr(res, 400, e?.message || "Failed to create access code");
    }
  });

  // --- FORGOT PASSWORD (Customer) ---
  app.post("/api/auth/forgot/start", (req: Request, res: Response) => {
    try {
      const { email } = z.object({ email: z.string().email() }).parse(req.body);
      const u = UserStore.byEmail(email);
      if (!u) return jsonErr(res, 404, "User not found");
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
      const tok = { id: nanoid(16), email, isAdmin: false, otp, createdAt: new Date().toISOString() };
      ResetStore.upsert(tok);
      // Email stub: log to server console (you can wire real provider later)
      console.log(`[RESET OTP] (customer) email=${email} otp=${otp} tokenId=${tok.id}`);
      return res.json({ resetId: tok.id });
    } catch (e:any) {
      return jsonErr(res, 400, e?.message || "Failed");
    }
  });

  app.post("/api/auth/forgot/complete", async (req: Request, res: Response) => {
    try {
      const { resetId, otp, newPassword } = z.object({
        resetId: z.string().min(8),
        otp: z.string().min(4),
        newPassword: z.string().min(8),
      }).parse(req.body);

      const tok = ResetStore.get(resetId);
      if (!tok || tok.isAdmin) return jsonErr(res, 400, "Invalid reset token");
      if (tok.otp !== otp) return jsonErr(res, 400, "Invalid OTP");
      const u = UserStore.byEmail(tok.email);
      if (!u) return jsonErr(res, 404, "User not found");
      u.passwordHash = await argon2.hash(newPassword);
      UserStore.upsert(u);
      tok.verifiedAt = new Date().toISOString();
      ResetStore.upsert(tok);
      return res.json({ ok: true });
    } catch (e:any) {
      return jsonErr(res, 400, e?.message || "Failed");
    }
  });

  // --- FORGOT PASSWORD (Admin — stricter verification) ---
  // Step 1: request reset
  app.post("/api/auth/admin/forgot/start", (req: Request, res: Response) => {
    try {
      const { email } = z.object({ email: z.string().email() }).parse(req.body);
      const u = UserStore.byEmail(email);
      if (!u || (u.role !== "admin" && u.role !== "superAdmin")) {
        return jsonErr(res, 404, "Admin not found");
      }
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const tok = { id: nanoid(16), email, isAdmin: true, otp, createdAt: new Date().toISOString() };
      ResetStore.upsert(tok);
      console.log(`[RESET OTP] (admin) email=${email} otp=${otp} tokenId=${tok.id}`);
      return res.json({ resetId: tok.id, challenge: "Provide OTP AND verificationPhrase" });
    } catch (e:any) {
      return jsonErr(res, 400, e?.message || "Failed");
    }
  });

  // Step 2: verify & complete (requires OTP + verification phrase)
  app.post("/api/auth/admin/forgot/complete", async (req: Request, res: Response) => {
    try {
      const { resetId, otp, verificationPhrase, newPassword } = z.object({
        resetId: z.string().min(8),
        otp: z.string().min(4),
        verificationPhrase: z.string().min(6),
        newPassword: z.string().min(12), // stronger for admin
      }).parse(req.body);

      const tok = ResetStore.get(resetId);
      if (!tok || !tok.isAdmin) return jsonErr(res, 400, "Invalid reset token");
      if (tok.otp !== otp) return jsonErr(res, 400, "Invalid OTP");
      if (verificationPhrase !== ADMIN_VERIFICATION_PHRASE) {
        return jsonErr(res, 403, "Verification failed");
      }
      const u = UserStore.byEmail(tok.email);
      if (!u) return jsonErr(res, 404, "Admin not found");
      u.passwordHash = await argon2.hash(newPassword);
      UserStore.upsert(u);
      tok.verifiedAt = new Date().toISOString();
      ResetStore.upsert(tok);
      return res.json({ ok: true });
    } catch (e:any) {
      return jsonErr(res, 400, e?.message || "Failed");
    }
  });

  // --- /me (validate token) ---
  app.get("/api/auth/me", (req: Request, res: Response) => {
    try {
      const auth = req.header("authorization") || "";
      const [, raw] = auth.split(" ");
      if (!raw) return jsonErr(res, 401, "Missing token");
      const user = jwt.verify(raw, JWT_SECRET);
      return res.json({ user });
    } catch {
      return jsonErr(res, 401, "Invalid token");
    }
  });
}
