
import { createClient } from 'redis';
import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';

interface KpiEvent {
  type: 'contact.created' | 'deal.won' | 'call.completed' | 'ticket.created' | 'revenue.added';
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
  accountId?: string;
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

class KpiAggregator {
  private redisClient: any;
  private io: Server;
  private isRunning = false;

  constructor() {
    this.initializeRedis();
    this.initializeSocket();
  }

  private async initializeRedis() {
    try {
      if (process.env.REDIS_URL) {
        this.redisClient = createClient({ url: process.env.REDIS_URL });
        await this.redisClient.connect();
        console.log('✅ Aggregator Redis connected');
      }
    } catch (error) {
      console.log('⚠️ Aggregator Redis not available');
    }
  }

  private initializeSocket() {
    const app = express();
    const server = createServer(app);
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    // Simple health endpoint for the worker
    app.get('/health', (req, res) => {
      res.json({ status: 'healthy', service: 'kpi-aggregator' });
    });

    const port = process.env.AGGREGATOR_PORT || 5001;
    server.listen(port, () => {
      console.log(`📊 KPI Aggregator listening on port ${port}`);
    });
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log('🚀 Starting KPI Aggregator...');

    if (!this.redisClient) {
      console.log('⚠️ No Redis available, aggregator will not function');
      return;
    }

    // Listen for KPI events on Redis stream
    while (this.isRunning) {
      try {
        await this.processKpiEvents();
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      } catch (error) {
        console.error('Aggregator error:', error);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay on error
      }
    }
  }

  private async processKpiEvents() {
    try {
      // Read from the KPI stream
      const results = await this.redisClient.xRead(
        { key: 'stream:kpi:events', id: '$' },
        { COUNT: 10, BLOCK: 1000 }
      );

      if (results) {
        for (const result of results) {
          const [streamKey, messages] = result;
          for (const [messageId, fields] of messages) {
            try {
              const event: KpiEvent = JSON.parse(fields.event);
              await this.processEvent(event);
            } catch (parseError) {
              console.error('Failed to parse KPI event:', parseError);
            }
          }
        }
      }
    } catch (error) {
      if (error.message?.includes('WRONGTYPE')) {
        // Stream doesn't exist yet, continue
        return;
      }
      throw error;
    }
  }

  private async processEvent(event: KpiEvent) {
    const accountId = event.accountId || 'default';
    
    // Get current metrics
    const currentMetrics = await this.getCurrentMetrics(accountId);
    
    // Update metrics based on event
    const updatedMetrics = this.updateMetrics(currentMetrics, event);
    
    // Save updated metrics
    await this.saveMetrics(accountId, updatedMetrics);
    
    // Emit to connected sockets
    this.io.emit('kpi:update', updatedMetrics);
    
    console.log(`📊 Processed ${event.type} for account ${accountId}`);
  }

  private async getCurrentMetrics(accountId: string): Promise<KpiMetrics> {
    try {
      const stored = await this.redisClient.hGetAll(`kpi:${accountId}`);
      if (Object.keys(stored).length === 0) {
        return this.getDefaultMetrics();
      }
      
      return {
        activeServices: parseInt(stored.activeServices) || 3,
        monthlySpend: parseInt(stored.monthlySpend) || 1250,
        supportTickets: parseInt(stored.supportTickets) || 2,
        accountStatus: 'Active',
        totalRevenue: parseInt(stored.totalRevenue) || 45000,
        completedOrders: parseInt(stored.completedOrders) || 127,
        avgOrderValue: parseInt(stored.avgOrderValue) || 354,
        customerSatisfaction: parseInt(stored.customerSatisfaction) || 92,
        avgResponseTime: parseFloat(stored.avgResponseTime) || 2.4,
        resolutionRate: parseInt(stored.resolutionRate) || 87,
        completedTasks: parseInt(stored.completedTasks) || 89
      };
    } catch (error) {
      console.error('Failed to get current metrics:', error);
      return this.getDefaultMetrics();
    }
  }

  private getDefaultMetrics(): KpiMetrics {
    return {
      activeServices: 3,
      monthlySpend: 1250,
      supportTickets: 2,
      accountStatus: 'Active',
      totalRevenue: 45000,
      completedOrders: 127,
      avgOrderValue: 354,
      customerSatisfaction: 92,
      avgResponseTime: 2.4,
      resolutionRate: 87,
      completedTasks: 89
    };
  }

  private updateMetrics(current: KpiMetrics, event: KpiEvent): KpiMetrics {
    const updated = { ...current };

    switch (event.type) {
      case 'contact.created':
        updated.activeServices += 1;
        break;
      case 'deal.won':
        updated.totalRevenue += event.value;
        updated.avgOrderValue = Math.round(updated.totalRevenue / Math.max(updated.completedOrders, 1));
        break;
      case 'call.completed':
        updated.completedOrders += 1;
        updated.avgOrderValue = Math.round(updated.totalRevenue / Math.max(updated.completedOrders, 1));
        break;
      case 'ticket.created':
        updated.supportTickets += 1;
        break;
      case 'revenue.added':
        updated.totalRevenue += event.value;
        updated.avgOrderValue = Math.round(updated.totalRevenue / Math.max(updated.completedOrders, 1));
        break;
    }

    return updated;
  }

  private async saveMetrics(accountId: string, metrics: KpiMetrics) {
    try {
      await this.redisClient.hSet(`kpi:${accountId}`, {
        activeServices: metrics.activeServices.toString(),
        monthlySpend: metrics.monthlySpend.toString(),
        supportTickets: metrics.supportTickets.toString(),
        totalRevenue: metrics.totalRevenue.toString(),
        completedOrders: metrics.completedOrders.toString(),
        avgOrderValue: metrics.avgOrderValue.toString(),
        customerSatisfaction: metrics.customerSatisfaction.toString(),
        avgResponseTime: metrics.avgResponseTime.toString(),
        resolutionRate: metrics.resolutionRate.toString(),
        completedTasks: metrics.completedTasks.toString()
      });
    } catch (error) {
      console.error('Failed to save metrics:', error);
    }
  }

  stop() {
    this.isRunning = false;
    if (this.redisClient) {
      this.redisClient.disconnect();
    }
  }
}

// Start the aggregator if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const aggregator = new KpiAggregator();
  aggregator.start().catch(console.error);

  process.on('SIGTERM', () => {
    console.log('Shutting down KPI aggregator...');
    aggregator.stop();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('Shutting down KPI aggregator...');
    aggregator.stop();
    process.exit(0);
  });
}

export { KpiAggregator };
