
import { Request, Response, NextFunction } from "express"
import { verifyJwt } from "../lib/jwt"

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token || (req.headers.authorization || "").replace(/^Bearer\s+/, "")
  if (!token) return res.status(401).json({ error: "Unauthorized" })
  try {
    const p = verifyJwt(token) as any
    ;(req as any).user = { id: Number(p.sub), orgId: p.orgId, role: p.role }
    return next()
  } catch {
    return res.status(401).json({ error: "Unauthorized" })
  }
}

export function authorize(required: string[] = []) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const u = (_req as any).user
    if (!u) return res.status(401).json({ error: "Unauthorized" })
    if (u.role === "superAdmin") return next()
    if (required.length === 0) return next()
    if (u.role === "admin") return next()
    return res.status(403).json({ error: "Forbidden" })
  }
}
