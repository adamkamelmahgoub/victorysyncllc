
import { Router } from "express";
import crypto from "crypto";

const router = Router();

router.post("/hubspot", (req, res) => {
  // Optional: validate X-HubSpot-Signature-v3 if configured
  const signature = req.headers["x-hubspot-signature-v3"] as string | undefined;
  if (process.env.HS_APP_SECRET && signature) {
    const base = (req as any).rawBody.toString() + process.env.HS_APP_SECRET;
    const digest = crypto.createHash("sha256").update(base).digest("hex");
    if (digest !== signature) return res.status(401).send("bad signature");
  }

  // Handle updates (contacts, tickets). Map to your local DB if needed.
  // Example payload array: [{ objectId, propertyName, propertyValue, ... }]
  // TODO: upsert into your CRM tables
  res.json({ ok: true });
});

export default router;
