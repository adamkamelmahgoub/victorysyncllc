export interface SiteFacts {
  legalName: string;
  brandName: string;
  alternateNames: readonly string[];
  phoneUS: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  afterHoursCoverage: string | boolean | null;
  complexLaunchTimeframe: string | null;
  pilotDescription: string | null;
  refundPolicy: string | false | null;
  paymentMethods: string | null;
  otherCRMs: readonly string[] | null;
  dashboardFeatures: readonly string[] | null;
  digitalMarketingDetails: { description: string; publishPricing: boolean } | null;
  documentedSavingsClaim: string | null;
  starterRateUsd: number;
  straightforwardLaunchTimeframe: string;
}

export const siteFacts: SiteFacts = {
  legalName: 'Victory Sync LLC',
  brandName: 'VictorySync',
  alternateNames: ['Victory Sync', 'Victory Sync LLC', 'VictorySync LLC'],
  phoneUS: '+1-848-216-1220',
  whatsapp: '+20-107-039-4707',
  email: 'info@victorysync.com',
  address: '11 Brookside Road, Millstone Township, NJ 08510',
  hours: 'Monday to Friday, 9:00am to 6:00pm Eastern',
  afterHoursCoverage: null,
  complexLaunchTimeframe: null,
  pilotDescription: null,
  refundPolicy: null,
  paymentMethods: null,
  otherCRMs: null,
  dashboardFeatures: null,
  digitalMarketingDetails: null,
  documentedSavingsClaim: null,
  starterRateUsd: 10,
  straightforwardLaunchTimeframe: '24 to 48 hours',
};

export type NullableSiteFact = 'afterHoursCoverage' | 'complexLaunchTimeframe' | 'pilotDescription' | 'refundPolicy' | 'paymentMethods' | 'otherCRMs' | 'dashboardFeatures' | 'digitalMarketingDetails' | 'documentedSavingsClaim';

export const nullFactEffects: Record<NullableSiteFact, readonly string[]> = {
  afterHoursCoverage: ['/book-call: after-hours audience bullet omitted', '/help-center: after-hours availability sentence omitted', 'industry pages: no after-hours coverage claim rendered'],
  complexLaunchTimeframe: ['/help-center: complex campaign launch timeframe sentence omitted'],
  pilotDescription: ['/help-center: pilots FAQ omitted', 'llms.txt: paid pilot sentence omitted'],
  refundPolicy: ['/help-center: refunds FAQ omitted'],
  paymentMethods: ['/help-center: payment methods FAQ omitted'],
  otherCRMs: ['/help-center: additional CRM experience sentence omitted'],
  dashboardFeatures: ['/platform: dashboard feature list replaced by the approved daily-summary fallback'],
  digitalMarketingDetails: ['/digital-marketing: page omitted', '/services and /contact: digital marketing removed from metadata'],
  documentedSavingsClaim: ['/book-call: numeric savings claim replaced by first-campaign description'],
};

export const siteOrigin = 'https://www.victorysync.com';
export const starterPriceLabel = `From $${siteFacts.starterRateUsd}/hr`;
export const phoneHref = `tel:${siteFacts.phoneUS.replace(/[^+\d]/g, '')}`;
export const whatsappHref = `https://wa.me/${siteFacts.whatsapp.replace(/\D/g, '')}`;
