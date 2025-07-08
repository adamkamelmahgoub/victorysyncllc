
import { kpiStore, KpiEvent } from '../kpiStore';

interface PipedriveWebhookPayload {
  event: string;
  current: {
    id: number;
    status: string;
    value?: number;
    currency?: string;
  };
  previous?: any;
}

export class PipedriveIntegration {
  private apiToken: string;

  constructor() {
    this.apiToken = process.env.PIPEDRIVE_API_TOKEN || '';
  }

  async pushEvent(payload: PipedriveWebhookPayload): Promise<void> {
    const event = this.normalizeEvent(payload);
    if (event) {
      await kpiStore.pushEvent(event);
    }
  }

  private normalizeEvent(payload: PipedriveWebhookPayload): KpiEvent | null {
    const timestamp = Date.now();

    switch (payload.event) {
      case 'added.person':
        return {
          type: 'contact.created',
          value: 1,
          timestamp,
          metadata: { source: 'pipedrive', objectId: payload.current.id }
        };
      case 'updated.deal':
        if (payload.current.status === 'won') {
          return {
            type: 'deal.won',
            value: payload.current.value || 3000,
            timestamp,
            metadata: { source: 'pipedrive', objectId: payload.current.id }
          };
        }
        break;
    }
    return null;
  }

  validateSignature(signature: string, payload: string): boolean {
    // Implement Pipedrive signature validation
    return process.env.NODE_ENV === 'development' || signature.length > 0;
  }
}

export const pipedriveIntegration = new PipedriveIntegration();
