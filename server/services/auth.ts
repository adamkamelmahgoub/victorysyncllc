
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { db } from '../db/client.js';
import { users, mfaBackupCodes } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';
export function signSession(u:any){ const payload={ id:u.id,email:u.email,orgId:u.orgId,role:u.role,permissions:u.permissions,isSuperAdmin:u.role==='superAdmin' }; return jwt.sign(payload, process.env.JWT_SECRET||'devsecret', { expiresIn:'7d' }); }
export function setAuthCookie(res:any, token:string){ res.cookie('vsess', token, { httpOnly:true, sameSite:'lax', secure:true }); }
export function requireAuth(req:any,res:any,next:any){ try{ const token=(req.cookies?.vsess)||(req.headers.authorization?.split(' ')[1]); if(!token) return res.status(401).json({error:'Unauthenticated'}); const payload=jwt.verify(token, process.env.JWT_SECRET||'devsecret'); req.user=payload; next(); }catch{ return res.status(401).json({error:'Unauthenticated'}); } }
export async function verifyPassword(hash:string,pw:string){ return argon2.verify(hash,pw); }
export async function hash(pw:string){ return argon2.hash(pw); }
export async function enroll2FA(u:any){ const secret=speakeasy.generateSecret({length:20,name:`VictorySync (${u.email})`}); const otpauth=secret.otpauth_url!; const qr=await (QRCode as any).toDataURL(otpauth); await db.update(users).set({ mfaEnabled:true }).where(eq(users.id,u.id)); return { secret:secret.base32, otpauth, qr }; }
