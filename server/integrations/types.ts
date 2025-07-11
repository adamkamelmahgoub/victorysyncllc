
export interface KPIMetrics {
  name: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  unit?: string;
  description?: string;
}

export interface Connector {
  name: string;
  type: string;
  isConfigured(customerId: string): Promise<boolean>;
  fetchKPIs(customerId: string, accessToken: string): Promise<KPIMetrics[]>;
  getOAuthUrl(customerId: string): string;
  handleOAuthCallback(code: string, customerId: string): Promise<{ accessToken: string; refreshToken?: string }>;
}

export interface Integration {
  id: string;
  customer_id: string;
  type: string;
  access_token: string;
  refresh_token?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}
