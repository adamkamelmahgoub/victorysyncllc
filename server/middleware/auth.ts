import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { toIntId } from "../db/id";

export function auth(req: Request, _res: Response, next: NextFunction) {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : undefined;
  const token = (req as any).cookies?.vs_token || bearer;
  if (!token) { (req as any).auth = null; return next(); }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const orgId = toIntId(payload.orgId, "orgId");
    (req as any).auth = {
          userId: payload.sub,
          orgId: orgId,
          role: payload.role
        };
  } catch {
    (req as any).auth = null;
  }
  next();
}