import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '30d';

export interface CustomerAuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
    privileges?: any;
    isActive: boolean;
  };
}

export const generateCustomerJWT = (user: any) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      role: 'customer',
      privileges: user.privileges,
      userType: 'customer'
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const authenticateCustomerJWT = async (req: CustomerAuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (decoded.userType !== 'customer') {
      return res.status(403).json({ error: "Customer access required" });
    }

    // Get customer from database
    const user = await storage.getPublicUserById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid or deactivated account" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'customer',
      privileges: user.privileges,
      isActive: user.isActive
    };

    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export const loginCustomer = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Get customer from database
    const user = await storage.getPublicUserByEmail(email);
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "Invalid credentials or account deactivated" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash || '');
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Update last login (using the privileges field to store last login)
    await storage.updatePublicUserSocialAccounts(user.id, [
      ...(user.socialAccounts || []),
      { type: 'lastLogin', timestamp: new Date().toISOString() }
    ]);

    // Generate JWT
    const token = generateCustomerJWT(user);

    res.json({ 
      success: true,
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: 'customer',
        privileges: user.privileges,
        isActive: user.isActive
      } 
    });
  } catch (error) {
    console.error("Customer login error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

export const registerCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    // Check if user already exists
    const existingUser = await storage.getPublicUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await storage.createPublicUser({
      name,
      email,
      passwordHash: hashedPassword,
      provider: 'local',
      socialAccounts: [],
      privileges: {
        role: 'customer',
        canAccessDashboard: true,
        canViewOrders: true,
        canManageIntegrations: true
      },
      isActive: true
    });

    // Generate JWT
    const token = generateCustomerJWT(user);

    res.json({ 
      success: true,
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: 'customer',
        privileges: user.privileges,
        isActive: user.isActive
      } 
    });
  } catch (error) {
    console.error("Customer registration error:", error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

export const getCurrentCustomer = async (req: CustomerAuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    res.json({ user: req.user, userType: 'customer' });
  } catch (error) {
    console.error("Get current customer error:", error);
    res.status(500).json({ error: "Failed to get user data" });
  }
};

// Admin role check middleware
export const requireAdmin = (req: CustomerAuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const adminRoles = ['admin', 'super_admin', 'billing', 'crm_manager'];
  if (!adminRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

// Super admin role check
export const requireSuperAdmin = (req: CustomerAuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Super admin access required' });
  }

  next();
};

// Audit logging helper
export const logAudit = async (
  userId: string,
  action: string,
  resource: string,
  resourceId?: string,
  details?: any,
  req?: Request
) => {
  try {
    await storage.createAuditLog({
      userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress: req?.ip || req?.socket?.remoteAddress,
      userAgent: req?.get('User-Agent'),
    });
  } catch (error) {
    console.error('Failed to log audit:', error);
  }
};