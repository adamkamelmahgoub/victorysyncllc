
import { Express } from "express";
export function registerKPIRoutes(app: Express){
  app.get("/api/kpi", (_req,res)=>{
    res.json({
      kpi:{
        activeAgents:0, callsToday:0, callsThisWeek:0, callsThisMonth:0,
        avgResponseTime:0, avgHandleTime:0, occupancyRate:0,
        customerSatisfaction:0, resolutionRate:0, slaCompliance:0
      }
    });
  });
}
