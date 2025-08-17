
import { Request, Response, NextFunction } from "express"
export function requireFeature(key: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const u = (req as any).user
    if (u?.role === "superAdmin") return next()
    return next()
  }
}
