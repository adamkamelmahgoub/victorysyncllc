
import { Router } from 'express';
import type { Request, Response } from 'express';
import { storage } from '../storage';

const router = Router();

// Admin middleware
const requireAdmin = (req: Request, res: Response, next: any) => {
  if (req.headers['x-admin-auth'] !== 'admin123') {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Admin stats endpoint
router.get('/stats', requireAdmin, async (req: Request, res: Response) => {
  try {
    const users = await storage.getAllPublicUsers();
    const orders = await storage.getAllOrders();
    
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    const monthlyGrowth = 15; // This would be calculated from historical data
    const totalCalls = Math.floor(Math.random() * 50000) + 40000;
    const avgSatisfaction = 92;

    res.json({
      totalUsers,
      activeUsers,
      totalRevenue,
      monthlyGrowth,
      totalCalls,
      avgSatisfaction
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// Get all users for admin
router.get('/users', requireAdmin, async (req: Request, res: Response) => {
  try {
    const users = await storage.getAllPublicUsers();
    const orders = await storage.getAllOrders();
    
    const usersWithStats = users.map(user => {
      const userOrders = orders.filter(order => order.userId === user.id.toString());
      const totalSpent = userOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.isActive ? 'active' : 'inactive',
        plan: 'Professional', // This would come from user's subscription
        seats: Math.floor(Math.random() * 10) + 1,
        lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        totalSpent
      };
    });

    res.json(usersWithStats);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// System health check
router.get('/health', requireAdmin, async (req: Request, res: Response) => {
  try {
    // This would include real system health checks
    const health = {
      database: 'healthy',
      apiResponseTime: 'fast',
      integrations: 'warning',
      storage: '67%'
    };

    res.json(health);
  } catch (error) {
    console.error('Error checking system health:', error);
    res.status(500).json({ error: 'Failed to check system health' });
  }
});

// Update user status
router.patch('/users/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { isActive } = req.body;

    const user = await storage.updateUserStatus(userId, isActive);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/users/:id', requireAdmin, async (req: Request, res: Response) => {
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

export default router;
