import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  auth?: {
    userId: string;
    orgId: number;
    role: string;
  };
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  // Skip auth for auth routes
  if (req.path.startsWith('/api/auth/')) {
    return next();
  }

  // Skip auth for public routes
  const publicRoutes = ['/api/packages', '/api/contact', '/api/health'];
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.vs_session;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    }

    if (!token) {
      return res.status(401).json({ ok: false, error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.auth = {
      userId: decoded.sub,
      orgId: decoded.orgId,
      role: decoded.role || 'admin'
    };

    next();
  } catch (error) {
    console.error("Auth middleware JWT verification failed:", error);
    res.status(401).json({ ok: false, error: 'Invalid or expired token' });
  }
}