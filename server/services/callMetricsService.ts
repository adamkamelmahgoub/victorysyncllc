
import { storage } from '../storage';
import { DialerProviderFactory } from '../integrations/dialerProvider';

export class CallMetricsService {
  private static instance: CallMetricsService;
  private pollInterval: number;
  private isPolling = false;

  private constructor() {
    this.pollInterval = parseInt(process.env.CALLS_POLL_SECONDS || '10') * 1000;
  }

  static getInstance(): CallMetricsService {
    if (!CallMetricsService.instance) {
      CallMetricsService.instance = new CallMetricsService();
    }
    return CallMetricsService.instance;
  }

  async startPolling() {
    if (this.isPolling) return;
    
    this.isPolling = true;
    console.log('🔄 Starting call metrics polling...');
    
    const poll = async () => {
      if (!this.isPolling) return;
      
      try {
        await this.refreshAllUserMetrics();
      } catch (error) {
        console.error('Error refreshing call metrics:', error);
      }
      
      setTimeout(poll, this.pollInterval);
    };

    poll();
  }

  stopPolling() {
    this.isPolling = false;
    console.log('⏹️ Stopped call metrics polling');
  }

  async refreshAllUserMetrics() {
    try {
      const dialerMappings = await storage.getAllDialerMappings();
      const providerName = process.env.DIALER_PROVIDER || 'twilio';
      
      if (!providerName) {
        return;
      }

      const provider = DialerProviderFactory.create(providerName);
      
      // Validate credentials before processing
      const isValid = await provider.validateCredentials();
      if (!isValid) {
        console.error(`Invalid credentials for dialer provider: ${providerName}`);
        return;
      }

      for (const mapping of dialerMappings) {
        try {
          const metrics = await provider.fetchCallMetrics(mapping.externalAgentId);
          
          // Update cache for each period
          await Promise.all([
            storage.updateCallsCache(mapping.userId, 'today', {
              callsCount: metrics.callsToday,
              avgHandleTime: metrics.avgHandleTime,
              occupancy: metrics.occupancy
            }),
            storage.updateCallsCache(mapping.userId, '7d', {
              callsCount: metrics.calls7d,
              avgHandleTime: metrics.avgHandleTime,
              occupancy: metrics.occupancy
            }),
            storage.updateCallsCache(mapping.userId, '30d', {
              callsCount: metrics.calls30d,
              avgHandleTime: metrics.avgHandleTime,
              occupancy: metrics.occupancy
            })
          ]);

        } catch (error) {
          console.error(`Failed to refresh metrics for user ${mapping.userId}:`, error);
        }
      }
    } catch (error) {
      console.error('Failed to refresh all user metrics:', error);
    }
  }

  async refreshUserMetrics(userId: number, forceRefresh = false) {
    try {
      const mapping = await storage.getDialerMapping(userId);
      if (!mapping) {
        throw new Error('User not mapped to dialer system');
      }

      const providerName = process.env.DIALER_PROVIDER || 'twilio';
      const provider = DialerProviderFactory.create(providerName);
      
      const metrics = await provider.fetchCallMetrics(mapping.externalAgentId);
      
      // Update cache
      await Promise.all([
        storage.updateCallsCache(userId, 'today', {
          callsCount: metrics.callsToday,
          avgHandleTime: metrics.avgHandleTime,
          occupancy: metrics.occupancy
        }),
        storage.updateCallsCache(userId, '7d', {
          callsCount: metrics.calls7d,
          avgHandleTime: metrics.avgHandleTime,
          occupancy: metrics.occupancy
        }),
        storage.updateCallsCache(userId, '30d', {
          callsCount: metrics.calls30d,
          avgHandleTime: metrics.avgHandleTime,
          occupancy: metrics.occupancy
        })
      ]);

      return {
        ...metrics,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Failed to refresh metrics for user ${userId}:`, error);
      throw error;
    }
  }

  async getUserCallMetrics(userId: number) {
    try {
      const cached = await storage.getCallsCache(userId);
      const mapping = await storage.getDialerMapping(userId);
      
      if (!mapping) {
        return {
          callsToday: 0,
          calls7d: 0,
          calls30d: 0,
          avgHandleTime: 0,
          occupancy: 0,
          liveStatus: 'offline',
          isLinked: false,
          lastUpdated: null
        };
      }

      // Check if data is stale (older than 10 minutes)
      const now = new Date();
      const todayCache = cached.find(c => c.period === 'today');
      const isStale = !todayCache || (now.getTime() - todayCache.updatedAt.getTime()) > 10 * 60 * 1000;

      return {
        callsToday: cached.find(c => c.period === 'today')?.callsCount || 0,
        calls7d: cached.find(c => c.period === '7d')?.callsCount || 0,
        calls30d: cached.find(c => c.period === '30d')?.callsCount || 0,
        avgHandleTime: cached.find(c => c.period === 'today')?.avgHandleTime || 0,
        occupancy: cached.find(c => c.period === 'today')?.occupancy || 0,
        liveStatus: 'available', // Would need real-time status from provider
        isLinked: true,
        lastUpdated: todayCache?.updatedAt?.toISOString() || null,
        isStale
      };
    } catch (error) {
      console.error(`Failed to get call metrics for user ${userId}:`, error);
      throw error;
    }
  }
}

export const callMetricsService = CallMetricsService.getInstance();
