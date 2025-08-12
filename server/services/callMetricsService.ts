
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
import { storage } from '../storage';

interface CallMetrics {
  callsCount: number;
  avgHandleTime: number;
  occupancy: number;
  liveStatus: 'online' | 'offline' | 'away' | 'busy';
}

interface DialerProvider {
  fetchCallMetrics(externalAgentId: string, period: string): Promise<CallMetrics>;
  getAgentStatus(externalAgentId: string): Promise<string>;
}

class TwilioProvider implements DialerProvider {
  private accountSid: string;
  private authToken: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
  }

  async fetchCallMetrics(workspaceSid: string, period: string): Promise<CallMetrics> {
    // Mock implementation - replace with actual Twilio API calls
    return {
      callsCount: Math.floor(Math.random() * 50),
      avgHandleTime: Math.floor(Math.random() * 300) + 60, // 1-5 minutes
      occupancy: Math.random() * 100,
      liveStatus: ['online', 'offline', 'away', 'busy'][Math.floor(Math.random() * 4)] as any
    };
  }

  async getAgentStatus(workspaceSid: string): Promise<string> {
    return ['online', 'offline', 'away', 'busy'][Math.floor(Math.random() * 4)];
  }
}

class Five9Provider implements DialerProvider {
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.clientId = process.env.FIVE9_CLIENT_ID || '';
    this.clientSecret = process.env.FIVE9_CLIENT_SECRET || '';
  }

  async fetchCallMetrics(agentId: string, period: string): Promise<CallMetrics> {
    // Mock implementation - replace with actual Five9 API calls
    return {
      callsCount: Math.floor(Math.random() * 75),
      avgHandleTime: Math.floor(Math.random() * 400) + 45,
      occupancy: Math.random() * 100,
      liveStatus: ['online', 'offline', 'away', 'busy'][Math.floor(Math.random() * 4)] as any
    };
  }

  async getAgentStatus(agentId: string): Promise<string> {
    return ['online', 'offline', 'away', 'busy'][Math.floor(Math.random() * 4)];
  }
}

class CallMetricsService {
  private providers: Map<string, DialerProvider> = new Map();

  constructor() {
    this.providers.set('twilio', new TwilioProvider());
    this.providers.set('five9', new Five9Provider());
  }

  async updateUserCallMetrics(userId: number): Promise<void> {
    try {
      const dialerMapping = await storage.getUserDialerMapping(userId);
      
      if (!dialerMapping) {
        return; // No dialer mapping configured
      }

      const provider = this.providers.get(dialerMapping.provider);
      if (!provider) {
        console.error(`Unknown dialer provider: ${dialerMapping.provider}`);
        return;
      }

      // Fetch metrics for different periods
      const periods = ['today', '7d', '30d'];
      
      for (const period of periods) {
        try {
          const metrics = await provider.fetchCallMetrics(dialerMapping.externalAgentId, period);
          const liveStatus = await provider.getAgentStatus(dialerMapping.externalAgentId);
          
          await storage.updateAccessControlCallMetrics(userId, {
            userId,
            dialerProvider: dialerMapping.provider,
            externalAgentId: dialerMapping.externalAgentId,
            period,
            callsCount: metrics.callsCount,
            avgHandleTime: metrics.avgHandleTime,
            occupancy: metrics.occupancy.toString(),
            liveStatus
          });
        } catch (error) {
          console.error(`Error fetching ${period} metrics for user ${userId}:`, error);
        }
      }
    } catch (error) {
      console.error(`Error updating call metrics for user ${userId}:`, error);
    }
  }

  async updateAllUsersCallMetrics(): Promise<void> {
    try {
      // Get all users with dialer mappings
      const users = await storage.getAllPublicUsers();
      
      for (const user of users) {
        await this.updateUserCallMetrics(user.id);
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Error updating call metrics for all users:', error);
    }
  }

  startPeriodicUpdates(): void {
    const updateInterval = (parseInt(process.env.CALLS_POLL_SECONDS || '300') * 1000); // Default 5 minutes
    
    setInterval(async () => {
      console.log('📊 Updating call metrics...');
      await this.updateAllUsersCallMetrics();
    }, updateInterval);
  }
}

export const callMetricsService = new CallMetricsService();
