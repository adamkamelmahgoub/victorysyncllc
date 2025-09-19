
import fetch from "node-fetch";

const HUBSPOT_BASE = "https://api.hubapi.com";
const headers = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export async function hsUpsertContact(token: string, email: string, props: Record<string,string|number>) {
  const r = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify({ properties: props }),
  });
  if (!r.ok) throw new Error(`HubSpot upsert failed: ${r.status} ${await r.text()}`);
  return r.json();
}

export async function hsCreateTicket(token: string, subject: string, content: string) {
  const r = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/tickets`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ properties: { subject, content, hs_pipeline: "0", hs_pipeline_stage: "1" } }),
  });
  if (!r.ok) throw new Error(`HubSpot ticket failed: ${r.status} ${await r.text()}`);
  return r.json();
}
