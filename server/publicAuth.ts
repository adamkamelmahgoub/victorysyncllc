import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerUserSchema, loginSchema, type PublicUser } from "../shared/schema.js";
import { storage } from "./storage";
import { sendEmail } from "./utils/sendEmail";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AuthenticatedRequest extends Request {
  user?: PublicUser;
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateJWT = (user: PublicUser): string => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "30d" }
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

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const validatedData = registerUserSchema.parse(req.body);
    
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
    });

    // Generate JWT
    const token = generateJWT(newUser);

    // Send email notification for new user signup
    await sendEmail({
      subject: "New User Signup",
      text: `A new user just signed up:\n\nName: ${newUser.name}\nEmail: ${newUser.email}`
    });

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
    const validatedData = loginSchema.parse(req.body);
    
    // Find user by email
    const user = await storage.getPublicUserByEmail(validatedData.email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password (only for local auth users)
    if (!user.passwordHash) {
      return res.status(401).json({ error: "Please use social login for this account" });
    }
    
    const isValidPassword = await comparePassword(validatedData.password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT
    const token = generateJWT(user);

    // Return user data without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    res.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ error: "Login failed" });
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