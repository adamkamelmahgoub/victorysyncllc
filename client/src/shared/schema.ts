
import { z } from "zod";

// Browser-safe types & validation only (no DB, no server code)
export const insertContactSubmissionSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  email: z.string().email("Valid email required"),
  message: z.string().min(1, "Message is required"),
});

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;

// Optional: keep lightweight public types so other client code can import safely
export type PlanId = "starter" | "growth" | "scale";

export type ContactRequest = {
  name: string;
  email: string;
  message: string;
  organizationId?: string;
};

export type OrganizationPublic = {
  id: string;
  name: string;
  timezone?: string;
  planId?: PlanId;
};

export const organizations: OrganizationPublic[] = [];
