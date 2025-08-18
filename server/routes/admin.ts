
import { Express, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { nanoid } from "nanoid";
import { UserStore, AccessStore } from "../lib/store";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
function requireAdmin(req: Request, res: Response): {id:string,email:string,role:string}|null {
  try {
    const auth = req.header("authorization")||""; const [,raw]=auth.split(" ");
    if(!raw) throw new Error("no token");
    const u = jwt.verify(raw, JWT_SECRET) as any;
    if(!u || (u.role!=="admin" && u.role!=="superAdmin")) throw new Error("forbidden");
    return u;
  } catch { res.status(403).json({error:"Forbidden"}); return null; }
}

export function registerAdminRoutes(app: Express){
  // Users
  app.get("/api/admin/users",(req,res)=>{
    if(!requireAdmin(req,res)) return;
    const users = UserStore.list().map(u=>({ id:u.id, email:u.email, role:u.role, org:u.org, createdAt:u.createdAt }));
    res.json({ users });
  });
  app.patch("/api/admin/users/:id",(req,res)=>{
    if(!requireAdmin(req,res)) return;
    const { role, org } = z.object({ role:z.enum(["superAdmin","admin","manager","agent","customer"]).optional(), org:z.string().optional() }).parse(req.body);
    const u = UserStore.byId(req.params.id); if(!u) return res.status(404).json({error:"Not found"});
    if(role) u.role = role; if(org!==undefined) u.org = org; UserStore.upsert(u);
    res.json({ ok:true, user:{ id:u.id,email:u.email,role:u.role,org:u.org }});
  });

  // Invite (creates access code scoped to email)
  app.post("/api/admin/invite",(req,res)=>{
    const me = requireAdmin(req,res); if(!me) return;
    const { email, role, org } = z.object({
      email: z.string().email(),
      role: z.enum(["superAdmin","admin","manager","agent","customer"]).default("customer"),
      org: z.string().optional()
    }).parse(req.body);
    const code = `INV-${nanoid(8).toUpperCase()}`;
    const rec = { code, email, role, org, maxUses:1, usedCount:0, isActive:true, createdAt:new Date().toISOString() } as any;
    AccessStore.upsert(rec);
    res.json({ ok:true, accessCode: rec });
  });
}
