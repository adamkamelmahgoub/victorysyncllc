
import type { Connector, KPIMetrics } from './types';

export class HubSpotConnector implements Connector {
  name = 'HubSpot';
  type = 'hubspot';

  async isConfigured(customerId: string): Promise<boolean> {
    // Check if customer has HubSpot integration configured
    const { db } = await import('../db');
    const integration = await db.query.integrations.findFirst({
      where: (integrations, { eq, and }) => and(
        eq(integrations.customer_id, customerId),
        eq(integrations.type, 'hubspot'),
        eq(integrations.is_active, true)
      )
    });
    return !!integration;
  }

  async fetchKPIs(customerId: string, accessToken: string): Promise<KPIMetrics[]> {
    try {
      const baseUrl = 'https://api.hubapi.com';
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };

      // Fetch various HubSpot metrics
      const [contactsResponse, dealsResponse, companiesResponse] = await Promise.all([
        fetch(`${baseUrl}/crm/v3/objects/contacts?limit=1&properties=`, { headers }),
        fetch(`${baseUrl}/crm/v3/objects/deals?limit=1&properties=`, { headers }),
        fetch(`${baseUrl}/crm/v3/objects/companies?limit=1&properties=`, { headers })
      ]);

      if (!contactsResponse.ok || !dealsResponse.ok || !companiesResponse.ok) {
        throw new Error('Failed to fetch HubSpot data');
      }

      const contacts = await contactsResponse.json();
      const deals = await dealsResponse.json();
      const companies = await companiesResponse.json();

      return [
        {
          name: 'Total Contacts',
          value: contacts.total || 0,
          unit: 'contacts',
          description: 'Total contacts in HubSpot CRM'
        },
        {
          name: 'Active Deals',
          value: deals.total || 0,
          unit: 'deals',
          description: 'Active deals in pipeline'
        },
        {
          name: 'Total Companies',
          value: companies.total || 0,
          unit: 'companies',
          description: 'Companies in CRM database'
        }
      ];
    } catch (error) {
      console.error('HubSpot KPI fetch error:', error);
      return [];
    }
  }

  getOAuthUrl(customerId: string): string {
    const clientId = process.env.HUBSPOT_CLIENT_ID;
    const redirectUri = `${process.env.BASE_URL}/api/integrations/hubspot/callback`;
    const scope = 'crm.objects.contacts.read crm.objects.deals.read crm.objects.companies.read';
    
    return `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${customerId}`;
  }

  async handleOAuthCallback(code: string, customerId: string): Promise<{ accessToken: string; refreshToken?: string }> {
    const clientId = process.env.HUBSPOT_CLIENT_ID;
    const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
    const redirectUri = `${process.env.BASE_URL}/api/integrations/hubspot/callback`;

    const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri,
        code
      })
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token
    };
  }
}

export const hubspotConnector = new HubSpotConnector();
