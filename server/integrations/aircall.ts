
import { kpiStore, KpiEvent } from '../kpiStore';

interface AircallWebhookPayload {
  event: string;
  data: {
    id: number;
    direction: string;
    status: string;
    duration?: number;
  };
}

export class AircallIntegration {
  private apiId: string;
  private apiToken: string;

  constructor() {
    this.apiId = process.env.AIRCALL_API_ID || '';
    this.apiToken = process.env.AIRCALL_API_TOKEN || '';
  }

  async pushEvent(payload: AircallWebhookPayload): Promise<void> {
    const event = this.normalizeEvent(payload);
    if (event) {
      await kpiStore.pushEvent(event);
    }
  }

  private normalizeEvent(payload: AircallWebhookPayload): KpiEvent | null {
    const timestamp = Date.now();

    if (payload.event === 'call.ended' && payload.data.status === 'done') {
      return {
        type: 'call.completed',
        value: 1,
        timestamp,
        metadata: { 
          source: 'aircall', 
          callId: payload.data.id,
          duration: payload.data.duration 
        }
      };
    }
    return null;
  }

  validateSignature(signature: string, payload: string): boolean {
    // Implement basic auth validation for Aircall
    return process.env.NODE_ENV === 'development' || signature.length > 0;
  }
}

export const aircallIntegration = new AircallIntegration();
