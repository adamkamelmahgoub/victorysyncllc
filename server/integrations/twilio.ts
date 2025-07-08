
import { kpiStore, KpiEvent } from '../kpiStore';

interface TwilioWebhookPayload {
  CallStatus: string;
  CallSid: string;
  From: string;
  To: string;
  CallDuration?: string;
}

export class TwilioIntegration {
  private accountSid: string;
  private authToken: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
  }

  async pushEvent(payload: TwilioWebhookPayload): Promise<void> {
    const event = this.normalizeEvent(payload);
    if (event) {
      await kpiStore.pushEvent(event);
    }
  }

  private normalizeEvent(payload: TwilioWebhookPayload): KpiEvent | null {
    const timestamp = Date.now();

    if (payload.CallStatus === 'completed') {
      return {
        type: 'call.completed',
        value: 1,
        timestamp,
        metadata: { 
          source: 'twilio', 
          callSid: payload.CallSid,
          duration: payload.CallDuration 
        }
      };
    }
    return null;
  }

  validateSignature(signature: string, payload: string, url: string): boolean {
    // Implement Twilio signature validation
    return process.env.NODE_ENV === 'development' || signature.length > 0;
  }
}

export const twilioIntegration = new TwilioIntegration();
