import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '30d';

export interface AdminAuthenticatedRequest extends Request {
  admin?: {
    id: number;
    username: string;
    name: string;
    role: string;
    permissions?: any;
  };
}

export const generateAdminJWT = (admin: any) => {
  return jwt.sign(
    { 
      id: admin.id, 
      username: admin.username, 
      name: admin.name, 
      role: admin.role,
      permissions: admin.permissions,
      userType: 'admin'
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const authenticateAdminJWT = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Admin access token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (decoded.userType !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }

    const admin = await storage.getAdminUserById(decoded.id);

    if (!admin) {
      return res.status(401).json({ error: "Invalid token - admin not found" });
    }

    if (!admin.isActive) {
      return res.status(403).json({ error: "Admin account has been deactivated" });
    }

    req.admin = {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role || 'admin',
      permissions: admin.permissions
    };
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired admin token" });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Hardcoded admin credentials - do not check database
    if (username === 'admin' && password === 'victorysync2025') {
      const adminUser = {
        id: 1,
        username: 'admin',
        name: 'Victory Sync Admin',
        role: 'super_admin',
        permissions: {
          canManageUsers: true,
          canViewAllOrders: true,
          canManageIntegrations: true,
          canViewAnalytics: true,
          canImpersonate: true,
          canManageSettings: true
        }
      };

      const token = generateAdminJWT(adminUser);

      res.json({ 
        token, 
        admin: { 
          id: adminUser.id, 
          username: adminUser.username, 
          name: adminUser.name, 
          role: adminUser.role 
        } 
      });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const getCurrentAdmin = async (req: AdminAuthenticatedRequest, res: Response) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: "Not authenticated as admin" });
    }

    res.json({ admin: req.admin, userType: 'admin' });
  } catch (error) {
    console.error("Get current admin error:", error);
    res.status(500).json({ error: "Failed to get admin data" });
  }
};