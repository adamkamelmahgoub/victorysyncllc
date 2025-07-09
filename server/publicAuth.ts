import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '30d';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export const generateJWT = (user: any) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      role: user.role || 'customer',
      userType: 'customer'
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

    const user = await storage.getPublicUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "Invalid token - user not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Account has been deactivated" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'customer'
    };
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if user already exists
    const existingUser = await storage.getPublicUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await storage.createPublicUser({
      name,
      email,
      passwordHash: hashedPassword,
      role: 'customer',
      isActive: true,
      socialAccounts: []
    });

    // Generate JWT
    const token = generateJWT(newUser);

    res.status(201).json({ 
      success: true,
      token, 
      user: { 
        id: newUser.id, 
        email: newUser.email, 
        name: newUser.name, 
        role: newUser.role 
      } 
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Get user by email
    const user = await storage.getPublicUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account has been deactivated" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Update last login - but don't let it fail the login process
    try {
      await storage.updateLastLogin(user.id);
    } catch (updateError) {
      console.warn("Failed to update last login:", updateError);
      // Continue with login process even if update fails
    }

    // Generate JWT
    const token = generateJWT(user);

    res.json({ 
      success: true,
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role || 'customer'
      } 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    res.json({ user: req.user, userType: 'customer' });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "Failed to get user data" });
  }
};

// Admin role check middleware
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
export const requireSuperAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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