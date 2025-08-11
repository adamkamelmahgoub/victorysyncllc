import { Router, Request, Response } from 'express';
import { authenticateJWT, AuthenticatedRequest } from '../lib/rbac';

const router = Router();

// Main KPI dashboard endpoint
router.get('/', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const now = new Date();
    const hour = now.getHours();

    // In production, these would come from integrated CRM/dialer APIs
    const kpiData = {
      callsToday: Math.floor(Math.random() * 200) + 150,
      callsThisWeek: Math.floor(Math.random() * 1000) + 800,
      callsThisMonth: Math.floor(Math.random() * 4000) + 3200,
      activeAgents: Math.floor(Math.random() * 15) + 8,
      avgResponseTime: Math.floor(Math.random() * 30) + 15,
      customerSatisfaction: Math.floor(Math.random() * 20) + 80,
      resolutionRate: Math.floor(Math.random() * 15) + 85,
      slaCompliance: Math.floor(Math.random() * 10) + 90,
      avgHandleTime: Math.floor(Math.random() * 100) + 180,
      occupancyRate: Math.floor(Math.random() * 20) + 75
    };

    res.json(kpiData);
  } catch (error) {
    console.error('Error fetching KPI data:', error);
    res.status(500).json({ error: 'Failed to fetch KPI data' });
  }
});

// Call volume data endpoint
router.get('/calls', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const now = new Date();
    const hour = now.getHours();

    const callVolumeData = {
      currentHour: 20 + Math.floor(Math.random() * 15),
      lastHour: 18 + Math.floor(Math.random() * 12),
      peakHour: hour >= 9 && hour <= 17 ? 'Yes' : 'No',
      averageWaitTime: Math.max(30, 120 - (hour * 3) + Math.random() * 60)
    };

    res.json(callVolumeData);
  } catch (error) {
    console.error('Error fetching call volume data:', error);
    res.status(500).json({ error: 'Failed to fetch call volume data' });
  }
});

// Agent performance endpoint
router.get('/agents', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const agents = [
      { id: 1, name: 'Sarah Johnson', status: 'active', callsToday: 45, avgHandleTime: 180, satisfaction: 92 },
      { id: 2, name: 'Mike Chen', status: 'active', callsToday: 38, avgHandleTime: 165, satisfaction: 94 },
      { id: 3, name: 'Emily Rodriguez', status: 'break', callsToday: 33, avgHandleTime: 145, satisfaction: 89 },
      { id: 4, name: 'David Kim', status: 'active', callsToday: 42, avgHandleTime: 172, satisfaction: 91 },
      { id: 5, name: 'Jessica Brown', status: 'offline', callsToday: 28, avgHandleTime: 158, satisfaction: 88 }
    ];

    res.json(agents);
  } catch (error) {
    console.error('Error fetching agent data:', error);
    res.status(500).json({ error: 'Failed to fetch agent data' });
  }
});

// Performance trends endpoint
router.get('/trends', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const trends = {
      daily: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        calls: Math.floor(Math.random() * 100) + 150,
        satisfaction: Math.floor(Math.random() * 20) + 80,
        avgHandleTime: Math.floor(Math.random() * 60) + 120
      })),
      weekly: Array.from({ length: 4 }, (_, i) => ({
        week: `Week ${i + 1}`,
        calls: Math.floor(Math.random() * 500) + 800,
        satisfaction: Math.floor(Math.random() * 15) + 85,
        avgHandleTime: Math.floor(Math.random() * 40) + 140
      }))
    };

    res.json(trends);
  } catch (error) {
    console.error('Error fetching trends data:', error);
    res.status(500).json({ error: 'Failed to fetch trends data' });
  }
});

export default router;