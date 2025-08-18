
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

async function ensureAdmin() {
  if (!UserStore.byEmail(ADMIN_EMAIL)) {
    const passwordHash = await argon2.hash(ADMIN_PASSWORD);
    UserStore.upsert({
      id: "u_admin",
      email: ADMIN_EMAIL,
      role: "superAdmin",
      passwordHash,
      createdAt: new Date().toISOString()
    });
  }
}
function sign(u: Pick<User,"id"|"email"|"role">){ return jwt.sign(u, JWT_SECRET, { expiresIn:"12h" }); }
function err(res: Response, code: number, msg: string){ return res.status(code).json({ error: msg }); }

export function registerAuthRoutes(app: Express) {
  ensureAdmin().catch(()=>{});

  app.post("/api/auth/login", async (req, res)=>{
    try{
      const { email, password } = z.object({ email:z.string().email(), password:z.string().min(1)}).parse(req.body);
      const u = UserStore.byEmail(email); if(!u) return err(res,401,"Invalid email or password");
      const ok = await argon2.verify(u.passwordHash, password); if(!ok) return err(res,401,"Invalid email or password");
      return res.json({ token: sign({id:u.id,email:u.email,role:u.role}), user:{ id:u.id,email:u.email,role:u.role }});
    }catch(e:any){ return err(res,400,e?.message||"Login failed"); }
  });

  app.post("/api/auth/register", async (req,res)=>{
    try{
      const body = z.object({ email:z.string().email(), password:z.string().min(8), name:z.string().min(1), org:z.string().min(1).optional(), accessCode:z.string().min(4)}).parse(req.body);
      const ac = AccessStore.get(body.accessCode); if(!ac || !ac.isActive) return err(res,400,"Invalid access code");
      if(ac.email && ac.email.toLowerCase()!==body.email.toLowerCase()) return err(res,400,"Access code not issued for this email");
      if(ac.expiresAt && new Date(ac.expiresAt) < new Date()) return err(res,400,"Access code expired");
      if(ac.usedCount >= ac.maxUses) return err(res,400,"Access code usage limit reached");
      if(UserStore.byEmail(body.email)) return err(res,400,"User already exists");
      const passwordHash = await argon2.hash(body.password);
      const u: User = { id:`u_${nanoid(10)}`, email: body.email, role: ac.role||"customer", org: body.org||ac.org, passwordHash, createdAt:new Date().toISOString() };
      UserStore.upsert(u); ac.usedCount += 1; AccessStore.upsert(ac);
      return res.json({ token: sign({id:u.id,email:u.email,role:u.role}), user: { id:u.id,email:u.email,role:u.role,org:u.org }});
    }catch(e:any){ return err(res,400,e?.message||"Registration failed"); }
  });

  // Customer forgot
  app.post("/api/auth/forgot/start",(req,res)=>{
    try{
      const { email } = z.object({ email:z.string().email() }).parse(req.body);
      const u = UserStore.byEmail(email); if(!u) return err(res,404,"User not found");
      const otp = Math.floor(100000+Math.random()*900000).toString(); const id=nanoid(16);
      ResetStore.upsert({ id, email, isAdmin:false, otp, createdAt:new Date().toISOString() });
      console.log(`[RESET OTP] customer email=${email} otp=${otp} tokenId=${id}`);
      return res.json({ resetId:id });
    }catch(e:any){ return err(res,400,e?.message||"Failed"); }
  });
  app.post("/api/auth/forgot/complete", async (req,res)=>{
    try{
      const { resetId, otp, newPassword } = z.object({ resetId:z.string().min(8), otp:z.string().min(4), newPassword:z.string().min(8)}).parse(req.body);
      const tok = ResetStore.get(resetId); if(!tok || tok.isAdmin) return err(res,400,"Invalid reset token");
      if(tok.otp !== otp) return err(res,400,"Invalid OTP");
      const u = UserStore.byEmail(tok.email); if(!u) return err(res,404,"User not found");
      u.passwordHash = await argon2.hash(newPassword); UserStore.upsert(u); tok.verifiedAt = new Date().toISOString(); ResetStore.upsert(tok);
      return res.json({ ok:true });
    }catch(e:any){ return err(res,400,e?.message||"Failed"); }
  });

  // Admin forgot (OTP + phrase)
  app.post("/api/auth/admin/forgot/start",(req,res)=>{
    try{
      const { email } = z.object({ email:z.string().email() }).parse(req.body);
      const u = UserStore.byEmail(email); if(!u || (u.role!=="admin" && u.role!=="superAdmin")) return err(res,404,"Admin not found");
      const otp = Math.floor(100000+Math.random()*900000).toString(); const id=nanoid(16);
      ResetStore.upsert({ id, email, isAdmin:true, otp, createdAt:new Date().toISOString() });
      console.log(`[RESET OTP] admin email=${email} otp=${otp} tokenId=${id}`);
      return res.json({ resetId:id, challenge:"Provide OTP and verificationPhrase" });
    }catch(e:any){ return err(res,400,e?.message||"Failed"); }
  });
  app.post("/api/auth/admin/forgot/complete", async (req,res)=>{
    try{
      const { resetId, otp, verificationPhrase, newPassword } = z.object({ resetId:z.string().min(8), otp:z.string().min(4), verificationPhrase:z.string().min(6), newPassword:z.string().min(12)}).parse(req.body);
      const tok = ResetStore.get(resetId); if(!tok || !tok.isAdmin) return err(res,400,"Invalid reset token");
      if(tok.otp !== otp) return err(res,400,"Invalid OTP");
      if(verificationPhrase !== ADMIN_VERIFICATION_PHRASE) return err(res,403,"Verification failed");
      const u = UserStore.byEmail(tok.email); if(!u) return err(res,404,"Admin not found");
      u.passwordHash = await argon2.hash(newPassword); UserStore.upsert(u); tok.verifiedAt = new Date().toISOString(); ResetStore.upsert(tok);
      return res.json({ ok:true });
    }catch(e:any){ return err(res,400,e?.message||"Failed"); }
  });

  app.get("/api/auth/me",(req,res)=>{
    try{
      const auth = req.header("authorization")||""; const [,raw]=auth.split(" "); if(!raw) return err(res,401,"Missing token");
      const user = jwt.verify(raw, JWT_SECRET); return res.json({ user });
    }catch{ return err(res,401,"Invalid token"); }
  });
}
