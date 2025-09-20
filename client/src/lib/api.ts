
export async function getEntitlements() {
  const res = await fetch("/api/me/entitlements", { headers: { "X-Org-Id": localStorage.getItem("orgId") || "" }});
  if (!res.ok) return { features: [] as string[] };
  return res.json() as Promise<{ features: string[] }>;
}
export async function checkout(planId: "starter"|"growth"|"scale") {
  const res = await fetch(`/api/billing/checkout/${planId}`, {
    method: "POST",
    headers: { "Content-Type":"application/json", "X-Org-Id": localStorage.getItem("orgId") || "" }
  });
  const { url } = await res.json();
  window.location.href = url;
}
