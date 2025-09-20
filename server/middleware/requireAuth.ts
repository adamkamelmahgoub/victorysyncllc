
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  auth?: {
    userId: string;
    orgId: number;
    role: string;
  };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.vs_session;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    }

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Attach auth info to request
    req.auth = {
      userId: decoded.sub,
      orgId: decoded.orgId,
      role: decoded.role || 'admin'
    };

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
