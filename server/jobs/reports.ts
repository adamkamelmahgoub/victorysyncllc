import cron from "node-cron";

export function startReportJobs() {
  cron.schedule("0 9 * * 1", async () => {  // Mondays 09:00
    // TODO: compute KPIs → render PDF (Puppeteer) → email link
    console.log("[reports] weekly reports queued");
  });
  cron.schedule("0 9 1 * *", async () => {
    console.log("[reports] monthly reports queued");
  });
}