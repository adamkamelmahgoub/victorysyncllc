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

    // Get admin from database
    const admin = await storage.getAdminUserById(decoded.id);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ error: "Invalid admin account" });
    }

    req.admin = {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role,
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
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    // Only allow the specific super admin credentials
    if (username !== 'kimo8723') {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Get admin from database
    const admin = await storage.getAdminUserByUsername(username);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: "Invalid credentials or account deactivated" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Update last login
    await storage.updateAdminLastLogin(admin.id);

    // Generate JWT
    const token = generateAdminJWT(admin);

    res.json({ 
      success: true,
      token, 
      admin: { 
        id: admin.id, 
        username: admin.username, 
        name: admin.name, 
        role: admin.role,
        permissions: admin.permissions
      } 
    });
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