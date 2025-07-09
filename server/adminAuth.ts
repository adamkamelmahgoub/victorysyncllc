
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '30d';

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'victorysync2025',
  id: 1,
  name: 'Victory Sync Admin',
  role: 'super_admin'
};

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

    // For hardcoded admin, just verify the token is valid
    if (decoded.username === ADMIN_CREDENTIALS.username) {
      req.admin = {
        id: decoded.id,
        username: decoded.username,
        name: decoded.name,
        role: decoded.role || 'super_admin',
        permissions: decoded.permissions
      };
      next();
    } else {
      return res.status(401).json({ error: "Invalid admin token" });
    }
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired admin token" });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    // Check hardcoded credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Generate JWT
      const token = generateAdminJWT(ADMIN_CREDENTIALS);

      res.json({ 
        success: true,
        token, 
        admin: { 
          id: ADMIN_CREDENTIALS.id, 
          username: ADMIN_CREDENTIALS.username, 
          name: ADMIN_CREDENTIALS.name, 
          role: ADMIN_CREDENTIALS.role 
        } 
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid admin credentials" });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
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
