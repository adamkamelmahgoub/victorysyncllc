
import cron from "node-cron";
import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";

function fill(template: string, data: Record<string, any>) {
  // very small token replacer supporting {{token}} and {{#each arr}}...{{/each}}
  let html = template;
  // arrays
  html = html.replace(/{{#each (\w+)}}([\s\S]*?){{\/each}}/g, (_, key, block) => {
    const arr = data[key] || [];
    return arr.map((row: any) => block.replace(/{{(\w+)}}/g, (_m: any, k: string) => row[k] ?? "")).join("");
  });
  // scalars
  html = html.replace(/{{(\w+)}}/g, (_m, k) => (data[k] ?? ""));
  return html;
}

export async function generateReportPDF(outFile: string, data: Record<string, any>) {
  const template = await fs.readFile(path.join(process.cwd(), "report_template.html"), "utf-8");
  const html = fill(template, data);

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.pdf({ path: outFile, format: "A4", printBackground: true, margin: { top: "16mm", right: "16mm", bottom: "16mm", left: "16mm" } });
  await browser.close();
}

export function startReportJobs() {
  cron.schedule("0 9 * * 1", async () => {
    // weekly (Growth+)
    // Fetch orgs with reports_weekly entitlement, compute stats, render PDF, email link
  });
  cron.schedule("0 9 1 * *", async () => {
    // monthly (Starter+)
  });
}
