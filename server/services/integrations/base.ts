
export interface IntegrationAdapter {
  connect(credentials: any): Promise<boolean>;
  disconnect(): Promise<boolean>;
  syncData(): Promise<any>;
  getMetrics(): Promise<any>;
  validateCredentials(credentials: any): Promise<boolean>;
}

export abstract class BaseIntegration implements IntegrationAdapter {
  protected apiKey?: string;
  protected baseUrl?: string;
  protected lastSync?: Date;

  constructor(config: any) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
  }

  abstract connect(credentials: any): Promise<boolean>;
  abstract disconnect(): Promise<boolean>;
  abstract syncData(): Promise<any>;
  abstract getMetrics(): Promise<any>;
  abstract validateCredentials(credentials: any): Promise<boolean>;
}
