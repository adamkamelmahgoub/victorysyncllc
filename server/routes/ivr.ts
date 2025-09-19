
import { Router } from "express";
import twilio from "twilio";
import { db } from "../db";
import { organizations } from "../../shared/schema";
import { eq } from "drizzle-orm";
import { DateTime } from "luxon";

const router = Router();
const VoiceResponse = twilio.twiml.VoiceResponse;

function inBusinessHours(tz: string) {
  const l = DateTime.now().setZone(tz);
  return l.weekday <= 5 && l.hour >= 9 && l.hour < 17; // M–F 9–5
}
function inExtendedHours(tz: string) {
  const l = DateTime.now().setZone(tz);
  return l.hour >= 8 && l.hour < 22; // 8a–10p any day
}

router.post("/voice/:orgId", async (req, res) => {
  const { orgId } = req.params;
  const org = await db.query.organizations.findFirst({ where: eq(organizations.id, orgId) });
  if (!org) return res.status(404).send("org not found");

  const vr = new VoiceResponse();
  const { planId, timezone } = org;

  const enqueue = (queue: string, priority: number) => {
    const e = vr.enqueue({ waitUrl: "", action: "" }, queue);
    e.parameter({ name: "orgId", value: orgId });
    e.parameter({ name: "priority", value: String(priority) });
  };

  // Priority by plan
  const priority = planId === "scale" ? 100 : planId === "growth" ? 50 : 10;

  if (planId === "scale") {
    enqueue(`vs:${orgId}:primary`, priority);  // always 24/7
  } else if (planId === "growth") {
    if (inExtendedHours(timezone)) enqueue(`vs:${orgId}:primary`, priority);
    else vr.say("Our office is currently closed. Please leave a message."); // or go to after-hours
  } else {
    if (inBusinessHours(timezone)) enqueue(`vs:${orgId}:primary`, priority);
    else vr.say("We are closed. Please call back during business hours.");
  }

  res.type("text/xml").send(vr.toString());
});

export default router;
