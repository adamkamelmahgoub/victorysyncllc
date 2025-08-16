
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Role } from "@shared/schema";

export type JwtUser = { 
  id: number; 
  orgId?: number; 
  role: Role; 
  permissions: string[]; 
  isSuperAdmin: boolean 
};

declare global { 
  namespace Express { 
    interface Request { 
      user?: JwtUser 
    } 
  } 
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token || 
    (req.headers.authorization?.startsWith("Bearer ") ? 
     req.headers.authorization.slice(7) : null);
  
  if (!token) {
    return res.status(401).json({ error: "unauthorized" });
  }
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as JwtUser;
    return next();
  } catch {
    return res.status(401).json({ error: "unauthorized" });
  }
}

export function authorize(perms: string[] = []) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "unauthorized" });
    }
    
    if (req.user.isSuperAdmin) {
      return next();
    }
    
    const hasPermissions = perms.every(p => req.user!.permissions.includes(p));
    return hasPermissions ? next() : res.status(403).json({ error: "forbidden" });
  };
}
