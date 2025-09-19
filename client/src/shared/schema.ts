
// ⚠️ Browser-safe exports ONLY (types/constants). No DB, no Node APIs.

export type PlanId = "starter" | "growth" | "scale";

export type ContactRequest = {
  name: string;
  email: string;
  message: string;
  organizationId?: string;
};

// If your UI expects an 'organizations' value, export a browser-safe shape:
export type OrganizationPublic = {
  id: string;
  name: string;
  timezone?: string;
  planId?: PlanId;
};

// Optional minimal placeholder to avoid runtime crashes until you wire the API:
export const organizations: OrganizationPublic[] = [];
