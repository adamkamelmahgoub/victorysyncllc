
interface CallMetrics {
  callsToday: number;
  calls7d: number;
  calls30d: number;
  avgHandleTime: number; // seconds
  occupancy: number; // percentage
  liveStatus: 'available' | 'busy' | 'offline';
}

interface DialerProvider {
  name: string;
  fetchCallMetrics(agentId: string): Promise<CallMetrics>;
  validateCredentials(): Promise<boolean>;
}

class TwilioProvider implements DialerProvider {
  name = 'twilio';
  
  private accountSid: string;
  private authToken: string;
  
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
  }

  async validateCredentials(): Promise<boolean> {
    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}.json`,
        {
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')
          }
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  async fetchCallMetrics(workerSid: string): Promise<CallMetrics> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Fetch call statistics from Twilio TaskRouter
      const [todayCalls, weekCalls, monthCalls, workerStats] = await Promise.all([
        this.fetchCallsForPeriod(workerSid, today, new Date()),
        this.fetchCallsForPeriod(workerSid, sevenDaysAgo, new Date()),
        this.fetchCallsForPeriod(workerSid, thirtyDaysAgo, new Date()),
        this.fetchWorkerStatistics(workerSid)
      ]);

      return {
        callsToday: todayCalls.length,
        calls7d: weekCalls.length,
        calls30d: monthCalls.length,
        avgHandleTime: this.calculateAverageHandleTime(monthCalls),
        occupancy: workerStats.occupancy,
        liveStatus: workerStats.activityName === 'Available' ? 'available' : 
                   workerStats.activityName === 'Busy' ? 'busy' : 'offline'
      };
    } catch (error) {
      console.error('Failed to fetch Twilio metrics:', error);
      return {
        callsToday: 0,
        calls7d: 0,
        calls30d: 0,
        avgHandleTime: 0,
        occupancy: 0,
        liveStatus: 'offline'
      };
    }
  }

  private async fetchCallsForPeriod(workerSid: string, startDate: Date, endDate: Date) {
    const response = await fetch(
      `https://taskrouter.twilio.com/v1/Workspaces/${process.env.TWILIO_WORKSPACE_SID}/Tasks?` +
      `AssignmentStatus=completed&WorkerSid=${workerSid}&` +
      `DateCreatedAfter=${startDate.toISOString()}&DateCreatedBefore=${endDate.toISOString()}`,
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')
        }
      }
    );

    const data = await response.json();
    return data.tasks || [];
  }

  private async fetchWorkerStatistics(workerSid: string) {
    const response = await fetch(
      `https://taskrouter.twilio.com/v1/Workspaces/${process.env.TWILIO_WORKSPACE_SID}/Workers/${workerSid}/Statistics?Minutes=1440`,
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')
        }
      }
    );

    const data = await response.json();
    return {
      occupancy: data.cumulative?.occupancy_ratio * 100 || 0,
      activityName: data.realtime?.activity_name || 'Offline'
    };
  }

  private calculateAverageHandleTime(calls: any[]): number {
    if (calls.length === 0) return 0;
    
    const totalTime = calls.reduce((sum, call) => {
      const duration = call.attributes?.duration || 0;
      return sum + duration;
    }, 0);

    return Math.round(totalTime / calls.length);
  }
}

class Five9Provider implements DialerProvider {
  name = 'five9';
  
  private clientId: string;
  private clientSecret: string;
  
  constructor() {
    this.clientId = process.env.FIVE9_CLIENT_ID || '';
    this.clientSecret = process.env.FIVE9_CLIENT_SECRET || '';
  }

  async validateCredentials(): Promise<boolean> {
    // Mock validation - implement actual Five9 OAuth flow
    return !!(this.clientId && this.clientSecret);
  }

  async fetchCallMetrics(agentId: string): Promise<CallMetrics> {
    // Mock implementation - replace with actual Five9 API calls
    return {
      callsToday: Math.floor(Math.random() * 50),
      calls7d: Math.floor(Math.random() * 300),
      calls30d: Math.floor(Math.random() * 1000),
      avgHandleTime: Math.floor(Math.random() * 300) + 60,
      occupancy: Math.floor(Math.random() * 80) + 10,
      liveStatus: ['available', 'busy', 'offline'][Math.floor(Math.random() * 3)] as any
    };
  }
}

class RingCentralProvider implements DialerProvider {
  name = 'ringcentral';
  
  private clientId: string;
  private clientSecret: string;
  
  constructor() {
    this.clientId = process.env.RINGCENTRAL_CLIENT_ID || '';
    this.clientSecret = process.env.RINGCENTRAL_CLIENT_SECRET || '';
  }

  async validateCredentials(): Promise<boolean> {
    // Mock validation - implement actual RingCentral OAuth flow
    return !!(this.clientId && this.clientSecret);
  }

  async fetchCallMetrics(extensionId: string): Promise<CallMetrics> {
    // Mock implementation - replace with actual RingCentral API calls
    return {
      callsToday: Math.floor(Math.random() * 40),
      calls7d: Math.floor(Math.random() * 280),
      calls30d: Math.floor(Math.random() * 1200),
      avgHandleTime: Math.floor(Math.random() * 250) + 90,
      occupancy: Math.floor(Math.random() * 75) + 15,
      liveStatus: ['available', 'busy', 'offline'][Math.floor(Math.random() * 3)] as any
    };
  }
}

export class DialerProviderFactory {
  static create(provider: string): DialerProvider {
    switch (provider) {
      case 'twilio':
        return new TwilioProvider();
      case 'five9':
        return new Five9Provider();
      case 'ringcentral':
        return new RingCentralProvider();
      default:
        throw new Error(`Unsupported dialer provider: ${provider}`);
    }
  }
}

export { CallMetrics, DialerProvider };
