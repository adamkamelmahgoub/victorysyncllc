import { Router, Request, Response } from 'express';
import { storage } from '../storage';

const router = Router();

// Simple admin auth middleware
const adminAuth = (req: Request, res: Response, next: any) => {
  const adminToken = req.headers['x-admin-auth'];
  if (adminToken !== 'admin123') {
    return res.status(401).json({ error: 'Unauthorized admin access' });
  }
  next();
};

// Apply admin auth to all routes
router.use(adminAuth);

// Get all users
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await storage.getAllPublicUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all orders
router.get('/orders', async (req: Request, res: Response) => {
  try {
    const orders = await storage.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update user status
router.put('/users/:id/status', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { isActive } = req.body;

    const updatedUser = await storage.updateUserStatus(userId, isActive);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Delete user
router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const success = await storage.deleteUser(userId);

    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Update user privileges
router.put('/users/:id/privileges', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { privileges } = req.body;

    const updatedUser = await storage.updateUserPrivileges(userId, privileges);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user privileges:', error);
    res.status(500).json({ error: 'Failed to update user privileges' });
  }
});

// Admin dashboard stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const users = await storage.getAllPublicUsers();
    const orders = await storage.getAllOrders();

    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(user => user.isActive !== false).length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.total || '0'), 0),
      recentUsers: users.slice(-5),
      recentOrders: orders.slice(-5)
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

export default router;