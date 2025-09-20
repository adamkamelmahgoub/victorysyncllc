
export type PlanId = 'starter' | 'growth' | 'scale';

export const Plans: Record<PlanId, { name: string; price: number; features: string[] }> = {
  starter: {
    name: 'Starter',
    price: 1200,
    features: [
      'dedicated_agent_1',
      'business_hours_support',
      'crm_basic',
      'email_support',
      'reports_monthly'
    ]
  },
  growth: {
    name: 'Growth',
    price: 2500,
    features: [
      'dedicated_agents_2',
      'extended_hours',
      'appointment_setting',
      'crm_advanced',
      'live_chat',
      'reports_weekly'
    ]
  },
  scale: {
    name: 'Scale',
    price: 4500,
    features: [
      'team_24_7_blended',
      'ai_automation_suite',
      'success_manager',
      'custom_integrations',
      'priority_support',
      'analytics_realtime'
    ]
  }
};
