import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import type { PublicUser } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthenticatedRequest extends Request {
  user?: PublicUser;
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // You could add database lookup here if needed
    // For now, we'll just use the decoded token data
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name || '',
      socialAccounts: []
    } as PublicUser;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};