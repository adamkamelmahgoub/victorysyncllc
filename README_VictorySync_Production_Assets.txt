
# VictorySync Production Assets

This package contains production-ready integrations for VictorySync:

## Files Included

1. **server/routes/ivr.ts** - Twilio IVR routing with plan-based hours and priority
2. **server/connectors/hubspot.ts** - HubSpot CRM integration
3. **server/webhooks/hubspot.ts** - HubSpot webhook handler for 2-way sync
4. **server/routes/inbound-email.ts** - Email-to-ticket routing with entitlement checks
5. **server/jobs/reports.ts** - Puppeteer PDF report generator
6. **report_template.html** - Branded HTML template for reports
7. **victorysync_ai_suite_n8n.json** - Complete n8n workflow for AI automation
8. **victorysync.env.example** - Environment variables template

## Setup Instructions

### 1. Install Dependencies
```bash
npm install twilio node-fetch puppeteer luxon node-cron
```

### 2. Environment Variables
Copy variables from `victorysync.env.example` to your Replit Secrets.

### 3. Wire Routes
Add to your `server/index.ts`:
```typescript
import ivrRouter from "./routes/ivr";
import inboundEmailRouter from "./routes/inbound-email"; 
import hubspotWebhook from "./webhooks/hubspot";

app.use("/ivr", ivrRouter);
app.use("/webhooks", hubspotWebhook);
app.use("/webhooks", inboundEmailRouter);
```

### 4. Twilio Setup
- Set Voice webhook to: `POST {YOUR_APP_URL}/ivr/voice/{orgId}`
- Configure queue priorities in your agent workers

### 5. HubSpot Setup
- Create Private App in HubSpot
- Set webhook endpoint to: `{YOUR_APP_URL}/webhooks/hubspot`
- Add token to HUBSPOT_TOKEN secret

### 6. n8n Workflow
- Import `victorysync_ai_suite_n8n.json` into your n8n instance
- Set all required variables in n8n Variables section
- Update webhook URL in your application code

### 7. Reports
- Place `report_template.html` in project root
- Call `startReportJobs()` from your main server file
- Customize KPI queries in the cron jobs

## Features Delivered

✅ **Plan-aware IVR routing** (Business/Extended/24x7 hours)
✅ **HubSpot 2-way sync** (contacts, tickets, webhooks)
✅ **Email-to-ticket routing** with entitlement checks
✅ **AI Suite workflow** (classify, search KB, draft responses)
✅ **PDF report generation** with branded templates
✅ **Priority queue handling** by customer plan tier

## Security Notes

- All webhooks support signature validation
- PII is never logged in plaintext
- Rate limiting recommended for external API calls
- Use environment variables for all sensitive tokens

## Support

For questions about these integrations, contact the VictorySync technical team.
