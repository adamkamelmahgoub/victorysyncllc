export const PUBLIC_ROUTES: ReadonlySet<string> = new Set([
  "/",
  "/services",
  "/pricing",
  "/about",
  "/about-us",
  "/contact",
  "/book-call",
  "/platform",
  "/inbound-support",
  "/appointment-setting",
  "/cold-calling",
  "/ai-automation",
  "/appointment-setting-for-home-services",
  "/cold-calling-for-plumbers",
  "/appointment-setting-for-real-estate",
  "/inbound-support-for-law-firms",
  "/help-center",
  "/privacy-policy",
  "/terms",
  "/dashboard",
]);

export function isKnownRoute(pathname: string): boolean {
  const clean = pathname.split("?")[0].replace(/\/$/, "") || "/";
  return PUBLIC_ROUTES.has(clean);
}

export const SITEMAP_ENTRIES: ReadonlyArray<{
  path: string;
  changefreq: string;
  priority: string;
}> = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/services", changefreq: "monthly", priority: "0.9" },
  { path: "/pricing", changefreq: "monthly", priority: "0.9" },
  { path: "/contact", changefreq: "monthly", priority: "0.8" },
  { path: "/book-call", changefreq: "monthly", priority: "0.8" },
  { path: "/inbound-support", changefreq: "monthly", priority: "0.9" },
  { path: "/appointment-setting", changefreq: "monthly", priority: "0.9" },
  { path: "/cold-calling", changefreq: "monthly", priority: "0.9" },
  { path: "/ai-automation", changefreq: "monthly", priority: "0.8" },
  { path: "/appointment-setting-for-home-services", changefreq: "monthly", priority: "0.8" },
  { path: "/cold-calling-for-plumbers", changefreq: "monthly", priority: "0.8" },
  { path: "/appointment-setting-for-real-estate", changefreq: "monthly", priority: "0.8" },
  { path: "/inbound-support-for-law-firms", changefreq: "monthly", priority: "0.8" },
  { path: "/platform", changefreq: "monthly", priority: "0.7" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/about-us", changefreq: "monthly", priority: "0.7" },
  { path: "/help-center", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];
