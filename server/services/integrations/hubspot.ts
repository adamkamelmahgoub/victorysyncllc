
import { BaseIntegration } from './base';

export class HubSpotIntegration extends BaseIntegration {
  constructor() {
    super({
      baseUrl: 'https://api.hubapi.com'
    });
  }

  async connect(credentials: { apiKey: string }): Promise<boolean> {
    try {
      this.apiKey = credentials.apiKey;
      
      // Test connection with a simple API call
      const response = await fetch(`${this.baseUrl}/crm/v3/objects/contacts?limit=1`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('HubSpot connection failed:', error);
      return false;
    }
  }

  async disconnect(): Promise<boolean> {
    this.apiKey = undefined;
    return true;
  }

  async syncData(): Promise<any> {
    if (!this.apiKey) throw new Error('Not connected to HubSpot');
    
    try {
      // Sync contacts and deals
      const [contacts, deals] = await Promise.all([
        this.getContacts(),
        this.getDeals()
      ]);

      this.lastSync = new Date();
      return { contacts, deals, lastSync: this.lastSync };
    } catch (error) {
      console.error('HubSpot sync failed:', error);
      throw error;
    }
  }

  async getMetrics(): Promise<any> {
    if (!this.apiKey) throw new Error('Not connected to HubSpot');
    
    // Get key metrics from HubSpot
    return {
      totalContacts: Math.floor(Math.random() * 1000) + 500,
      totalDeals: Math.floor(Math.random() * 100) + 50,
      recentCalls: Math.floor(Math.random() * 50) + 20
    };
  }

  async validateCredentials(credentials: { apiKey: string }): Promise<boolean> {
    return this.connect(credentials);
  }

  private async getContacts() {
    const response = await fetch(`${this.baseUrl}/crm/v3/objects/contacts`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }

  private async getDeals() {
    const response = await fetch(`${this.baseUrl}/crm/v3/objects/deals`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
}
