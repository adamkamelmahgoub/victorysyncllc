
import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'

export interface AuthRequest extends Request {
  user?: {
    id: number
    email: string
    role: string
    orgId: string
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const COOKIE_NAME = 'vs_session'

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies[COOKIE_NAME]

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      orgId: decoded.orgId
    }
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
