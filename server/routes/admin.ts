
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { storage } from "../storage";

const router = express.Router();

// Hard-coded admin credentials (in production, store in database)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "victorysync2025"
};

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Admin authentication middleware
export const authenticateAdmin = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Admin access token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid admin token" });
  }
};

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const token = jwt.sign(
        { username, role: 'admin' },
        JWT_SECRET,
        { expiresIn: "8h" }
      );

      res.json({
        token,
        user: { username, role: 'admin' }
      });
    } else {
      res.status(401).json({ error: "Invalid admin credentials" });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Get all users
router.get("/users", authenticateAdmin, async (req, res) => {
  try {
    const users = await storage.getAllPublicUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get all orders
router.get("/orders", authenticateAdmin, async (req, res) => {
  try {
    const orders = await storage.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Get contact submissions
router.get("/contact-submissions", authenticateAdmin, async (req, res) => {
  try {
    const submissions = await storage.getContactSubmissions();
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    res.status(500).json({ error: "Failed to fetch contact submissions" });
  }
});

// Update user status
router.put("/users/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const user = await storage.updateUserStatus(parseInt(id), isActive);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ error: "Failed to update user status" });
  }
});

// Delete user
router.delete("/users/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const success = await storage.deleteUser(parseInt(id));
    if (success) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Create admin user
router.post("/users/admin", authenticateAdmin, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // In a real implementation, you'd store admin users in a separate table
    // For now, just return success
    res.json({
      id: Date.now(),
      username,
      email,
      role,
      isActive: true,
      lastLogin: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    res.status(500).json({ error: "Failed to create admin user" });
  }
});

export default router;
