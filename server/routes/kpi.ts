import { Router, Request, Response } from 'express';
import { authenticateToken, AuthRequest } from '../publicAuth';

const router = Router();

// Mock CRM integration - replace with actual API calls
interface CRMData {
  totalCalls: number;
  averageResponseTime: number;
  customerSatisfaction: number;
  activeAgents: number;
  callsToday: number;
  callsThisWeek: number;
  callsThisMonth: number;
  conversionRate: number;
}

// Real-time KPI data endpoint
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    // This would integrate with actual CRM APIs like Salesforce, HubSpot, etc.
    // For now, providing dynamic data that changes based on time
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    const kpiData: CRMData = {
      totalCalls: 1250 + (hour * 15) + Math.floor(minute / 2),
      averageResponseTime: Math.max(15, 45 - hour + Math.random() * 10),
      customerSatisfaction: Math.min(100, 85 + Math.random() * 15),
      activeAgents: Math.max(1, 25 - Math.floor(hour / 3) + Math.floor(Math.random() * 5)),
      callsToday: 150 + (hour * 8) + Math.floor(minute / 3),
      callsThisWeek: 950 + (hour * 45),
      callsThisMonth: 3200 + (hour * 120),
      conversionRate: Math.min(100, 15 + Math.random() * 25)
    };

    res.json(kpiData);
  } catch (error) {
    console.error('Error fetching KPI data:', error);
    res.status(500).json({ error: 'Failed to fetch KPI data' });
  }
});

// Real-time call volume endpoint
router.get('/call-volume', authenticateToken, async (req: AuthRequest, res: Response) => {
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
router.get('/agents', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const agents = [
      { id: 1, name: 'Ahmed Hassan', status: 'active', callsToday: 45, avgHandleTime: 180, satisfaction: 92 },
      { id: 2, name: 'Fatima Ali', status: 'active', callsToday: 38, avgHandleTime: 165, satisfaction: 94 },
      { id: 3, name: 'Mohamed Salah', status: 'break', callsToday: 33, avgHandleTime: 145, satisfaction: 89 },
      { id: 4, name: 'Yasmin Ahmed', status: 'active', callsToday: 42, avgHandleTime: 172, satisfaction: 91 },
      { id: 5, name: 'Omar Ibrahim', status: 'offline', callsToday: 28, avgHandleTime: 158, satisfaction: 88 }
    ];

    res.json(agents);
  } catch (error) {
    console.error('Error fetching agent data:', error);
    res.status(500).json({ error: 'Failed to fetch agent data' });
  }
});

export default router;