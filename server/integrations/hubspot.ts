
import { kpiStore, KpiEvent } from '../kpiStore';

interface HubSpotWebhookPayload {
  subscriptionType: string;
  eventId: number;
  propertyName?: string;
  propertyValue?: string;
  changeSource: string;
  objectId: number;
  objectType: string;
}

export class HubSpotIntegration {
  private accessToken: string;

  constructor() {
    this.accessToken = process.env.HUBSPOT_ACCESS_TOKEN || '';
  }

  async pushEvent(payload: HubSpotWebhookPayload): Promise<void> {
    const event = this.normalizeEvent(payload);
    if (event) {
      await kpiStore.pushEvent(event);
    }
  }

  private normalizeEvent(payload: HubSpotWebhookPayload): KpiEvent | null {
    const timestamp = Date.now();

    switch (payload.subscriptionType) {
      case 'contact.creation':
        return {
          type: 'contact.created',
          value: 1,
          timestamp,
          metadata: { source: 'hubspot', objectId: payload.objectId }
        };
      case 'deal.propertyChange':
        if (payload.propertyName === 'dealstage' && payload.propertyValue === 'closedwon') {
          return {
            type: 'deal.won',
            value: 5000, // Default deal value
            timestamp,
            metadata: { source: 'hubspot', objectId: payload.objectId }
          };
        }
        break;
    }
    return null;
  }

  validateSignature(signature: string, payload: string): boolean {
    // Implement HubSpot signature validation
    return process.env.NODE_ENV === 'development' || signature.length > 0;
  }
}

export const hubspotIntegration = new HubSpotIntegration();
