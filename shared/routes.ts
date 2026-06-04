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
  "/blog",
  "/careers",
  "/help-center",
  "/docs",
  "/privacy-policy",
  "/terms",
  "/checkout",
  "/register",
  "/signup",
  "/login",
  "/dashboard",
]);

export const BLOG_SLUGS: ReadonlySet<string> = new Set([
  "reduce-customer-service-costs",
  "ai-automation-vs-human-touch",
  "when-to-outsource-call-center",
  "building-customer-loyalty",
  "scaling-outsourced-support",
  "roi-of-customer-service",
]);

export function isKnownRoute(pathname: string): boolean {
  const clean = pathname.split("?")[0].replace(/\/$/, "") || "/";
  if (PUBLIC_ROUTES.has(clean)) return true;
  const blogMatch = clean.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) return BLOG_SLUGS.has(blogMatch[1]);
  return false;
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
  { path: "/platform", changefreq: "monthly", priority: "0.7" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/about-us", changefreq: "monthly", priority: "0.7" },
  { path: "/careers", changefreq: "monthly", priority: "0.5" },
  { path: "/blog", changefreq: "weekly", priority: "0.7" },
  ...Array.from(BLOG_SLUGS).map((slug) => ({
    path: `/blog/${slug}`,
    changefreq: "monthly",
    priority: "0.6",
  })),
  { path: "/help-center", changefreq: "monthly", priority: "0.5" },
  { path: "/docs", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];
