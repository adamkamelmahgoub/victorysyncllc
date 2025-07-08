
import { createClient } from 'redis';

interface KpiEvent {
  type: 'contact.created' | 'deal.won' | 'call.completed' | 'ticket.created' | 'revenue.added';
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface KpiMetrics {
  activeServices: number;
  monthlySpend: number;
  supportTickets: number;
  accountStatus: 'Active' | 'Inactive';
  totalRevenue: number;
  completedOrders: number;
  avgOrderValue: number;
  customerSatisfaction: number;
  avgResponseTime: number;
  resolutionRate: number;
  completedTasks: number;
}

class KpiStore {
  private memoryStore = new Map<string, number>();
  private redisClient: any;
  private listeners: Array<(metrics: KpiMetrics) => void> = [];

  constructor() {
    this.initRedis();
    this.initDefaults();
  }

  private async initRedis() {
    try {
      if (process.env.REDIS_URL) {
        this.redisClient = createClient({ url: process.env.REDIS_URL });
        await this.redisClient.connect();
        console.log('✅ Redis connected for KPI store');
      }
    } catch (error) {
      console.log('⚠️ Redis not available, using in-memory store');
    }
  }

  private initDefaults() {
    this.memoryStore.set('activeServices', 3);
    this.memoryStore.set('monthlySpend', 1250);
    this.memoryStore.set('supportTickets', 2);
    this.memoryStore.set('totalRevenue', 45000);
    this.memoryStore.set('completedOrders', 127);
    this.memoryStore.set('customerSatisfaction', 92);
    this.memoryStore.set('avgResponseTime', 2.4);
    this.memoryStore.set('resolutionRate', 87);
    this.memoryStore.set('completedTasks', 89);
  }

  async pushEvent(event: KpiEvent): Promise<void> {
    // Push to Redis stream for aggregator to process
    if (this.redisClient) {
      try {
        await this.redisClient.xAdd('stream:kpi:events', '*', {
          event: JSON.stringify(event)
        });
        console.log(`📊 KPI event pushed to stream: ${event.type}`);
      } catch (error) {
        console.error('Failed to push event to Redis stream:', error);
        // Fallback to direct processing
        await this.processEventDirectly(event);
      }
    } else {
      // Fallback to direct processing if no Redis
      await this.processEventDirectly(event);
    }
  }

  private async processEventDirectly(event: KpiEvent): Promise<void> {
    const key = this.getKeyForEventType(event.type);
    if (!key) return;

    const currentValue = await this.getValue(key);
    const newValue = this.calculateNewValue(event.type, currentValue, event.value);
    
    await this.setValue(key, newValue);
    this.notifyListeners();
  }

  private getKeyForEventType(type: KpiEvent['type']): string | null {
    const mapping: Record<KpiEvent['type'], string> = {
      'contact.created': 'activeServices',
      'deal.won': 'totalRevenue',
      'call.completed': 'completedOrders',
      'ticket.created': 'supportTickets',
      'revenue.added': 'totalRevenue'
    };
    return mapping[type] || null;
  }

  private calculateNewValue(type: KpiEvent['type'], current: number, eventValue: number): number {
    switch (type) {
      case 'contact.created':
      case 'call.completed':
      case 'ticket.created':
        return current + 1;
      case 'deal.won':
      case 'revenue.added':
        return current + eventValue;
      default:
        return current;
    }
  }

  private async getValue(key: string): Promise<number> {
    if (this.redisClient) {
      try {
        const value = await this.redisClient.get(`kpi:${key}`);
        return value ? parseInt(value) : this.memoryStore.get(key) || 0;
      } catch (error) {
        return this.memoryStore.get(key) || 0;
      }
    }
    return this.memoryStore.get(key) || 0;
  }

  private async setValue(key: string, value: number): Promise<void> {
    this.memoryStore.set(key, value);
    if (this.redisClient) {
      try {
        await this.redisClient.set(`kpi:${key}`, value.toString());
      } catch (error) {
        console.log('Redis write failed, using memory only');
      }
    }
  }

  async getMetrics(): Promise<KpiMetrics> {
    const avgOrderValue = await this.getValue('totalRevenue') / Math.max(await this.getValue('completedOrders'), 1);
    
    return {
      activeServices: await this.getValue('activeServices'),
      monthlySpend: await this.getValue('monthlySpend'),
      supportTickets: await this.getValue('supportTickets'),
      accountStatus: 'Active',
      totalRevenue: await this.getValue('totalRevenue'),
      completedOrders: await this.getValue('completedOrders'),
      avgOrderValue: Math.round(avgOrderValue),
      customerSatisfaction: await this.getValue('customerSatisfaction'),
      avgResponseTime: await this.getValue('avgResponseTime'),
      resolutionRate: await this.getValue('resolutionRate'),
      completedTasks: await this.getValue('completedTasks')
    };
  }

  subscribe(listener: (metrics: KpiMetrics) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  private async notifyListeners(): Promise<void> {
    const metrics = await this.getMetrics();
    this.listeners.forEach(listener => listener(metrics));
  }
}

export const kpiStore = new KpiStore();
export type { KpiEvent, KpiMetrics };
