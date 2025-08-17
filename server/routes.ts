import { Express } from "express";
import { registerAuthRoutes } from "./routes/auth";

export function registerRoutes(app: Express) {
  registerAuthRoutes(app);
  // future: registerBillingRoutes(app), registerAdminRoutes(app), etc.
}