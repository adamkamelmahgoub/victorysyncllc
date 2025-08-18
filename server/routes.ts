
import { Express } from "express";
import { registerAuthRoutes } from "./routes/auth";
import { registerAdminRoutes } from "./routes/admin";
import { registerAccessRoutes } from "./routes/access";
import { registerKPIRoutes } from "./routes/kpi";

export function registerRoutes(app: Express) {
  registerAuthRoutes(app);
  registerAdminRoutes(app);
  registerAccessRoutes(app);
  registerKPIRoutes(app);
}
