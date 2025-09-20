import { Request, Response, NextFunction } from "express";

/**
 * Replace this with your real auth.
 * For now we accept JWT in Authorization OR X-Org-Id for service-to-service.
 */
export function fakeAuth(req: Request, _res: Response, next: NextFunction) {
  const orgId = (req.headers["x-org-id"] as string) || null;
  (req as any).auth = orgId ? { orgId } : null;
  next();
}