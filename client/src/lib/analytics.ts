declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    trackingFunctions?: {
      onLoad?: (options: { appId: string }) => void;
    };
    requestIdleCallback?: (callback: IdleRequestCallback) => number;
  }
}

const runWhenIdle = (callback: () => void) => {
  const schedule = window.requestIdleCallback || ((fn: () => void) => window.setTimeout(fn, 1500));

  if (document.readyState === "complete") {
    schedule(callback);
  } else {
    window.addEventListener("load", () => schedule(callback), { once: true });
  }
};

const appendScript = (src: string, onload?: () => void) => {
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  if (onload) script.onload = onload;
  document.head.appendChild(script);
};

function loadMetaPixel() {
  if (window.fbq) return;

  const fbq = function (...args: unknown[]) {
    const queue = (fbq as typeof fbq & { queue?: unknown[] }).queue || [];
    queue.push(args);
    (fbq as typeof fbq & { queue: unknown[] }).queue = queue;
  } as typeof window.fbq & {
    loaded?: boolean;
    version?: string;
    queue?: unknown[];
    push?: typeof window.fbq;
  };

  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  fbq.push = fbq;
  window.fbq = fbq;
  window._fbq = fbq;

  appendScript("https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", "2060370554550917");
  window.fbq("track", "PageView");
}

export function loadMarketingAnalytics() {
  runWhenIdle(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
    window.gtag("js", new Date());
    window.gtag("config", "G-QG0JH52J6D");

    appendScript("https://www.googletagmanager.com/gtag/js?id=G-QG0JH52J6D");
    loadMetaPixel();
    appendScript(
      `https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=${Math.random()
        .toString(36)
        .slice(2)}`,
      () => window.trackingFunctions?.onLoad?.({ appId: "69da757e559c95000d5a0fc5" }),
    );
  });
}
