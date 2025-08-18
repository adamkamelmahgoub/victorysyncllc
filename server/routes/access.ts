
import { Express } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { AccessStore } from "../lib/store";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
function isAdmin(req:any){ try{ const auth=req.header("authorization")||""; const [,raw]=auth.split(" "); const u=jwt.verify(raw,JWT_SECRET) as any; return u && (u.role==="admin"||u.role==="superAdmin"); }catch{return false;} }

export function registerAccessRoutes(app: Express){
  app.get("/api/access-codes",(req,res)=>{
    if(!isAdmin(req)) return res.status(403).json({error:"Forbidden"});
    res.json({ codes: AccessStore.list() });
  });
  app.patch("/api/access-codes/:code",(req,res)=>{
    if(!isAdmin(req)) return res.status(403).json({error:"Forbidden"});
    const body = z.object({ isActive:z.boolean().optional(), maxUses:z.number().int().positive().optional(), expiresAt:z.string().datetime().optional() }).parse(req.body);
    const rec = AccessStore.get(req.params.code);
    if(!rec) return res.status(404).json({error:"Not found"});
    if(body.isActive!==undefined) rec.isActive = body.isActive;
    if(body.maxUses!==undefined) rec.maxUses = body.maxUses;
    if(body.expiresAt!==undefined) rec.expiresAt = body.expiresAt;
    AccessStore.upsert(rec);
    res.json({ ok:true, accessCode: rec });
  });
}
