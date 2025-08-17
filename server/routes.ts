
import { Express } from "express";
import { registerAuthRoutes } from "./routes/auth";

export function registerRoutes(app: Express) {
  registerAuthRoutes(app);
  // future: add more route modules here (billing, admin, etc.)
}
