import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { insertUserSchema } from '@shared/schema';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '30d';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
    permissions?: any;
  };
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateJWT = (user: any) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      role: user.role,
      permissions: user.permissions
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const verifyJWT = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};

export const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = verifyJWT(token);
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
      role: user.role || 'user',
      permissions: user.permissions
    };
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const validatedData = insertUserSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await storage.getPublicUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // Create user
    const newUser = await storage.createPublicUser({
      name: validatedData.name,
      email: validatedData.email,
      passwordHash,
      provider: "local",
      role: validatedData.role || 'user',
      permissions: validatedData.permissions
    });

    // Generate JWT
    const token = generateJWT(newUser);

    // Return user data without password hash
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      token,
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ error: "Registration failed" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await storage.getPublicUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await storage.updateLastLogin(user.id);

    // Log audit event
    await logAudit(user.id.toString(), 'login', 'user', user.id.toString(), {
      email: user.email,
      role: user.role
    }, req);

    // Generate JWT token
    const token = generateJWT(user);

    // Return user data (excluding password) and token
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json({ 
      user: userWithoutPassword,
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Return user data without password hash
    const { passwordHash: _, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
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