import { useEffect, useRef } from 'react';
import { CLUTCH_COMPANY_ID, CLUTCH_WIDGET_ENABLED } from '@/lib/site-config';

const scriptUrl = 'https://widget.clutch.co/static/js/widget.js';
let scriptRequested = false;

export default function ClutchWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!CLUTCH_WIDGET_ENABLED || !container.current || scriptRequested) return;
    const element = container.current;
    const load = () => {
      if (scriptRequested || document.querySelector(`script[src="${scriptUrl}"]`)) return;
      scriptRequested = true;
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      document.head.appendChild(script);
    };
    if (!('IntersectionObserver' in window)) { load(); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { observer.disconnect(); load(); }
    }, { rootMargin: '300px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (!CLUTCH_WIDGET_ENABLED || !CLUTCH_COMPANY_ID || CLUTCH_COMPANY_ID.includes('[SUPPLY]')) return null;
  return <div ref={container} style={{ minHeight: 45, overflow: 'visible' }}>
    <div
      className="clutch-widget"
      data-url="https://widget.clutch.co"
      data-widget-type="2"
      data-height="45"
      data-nofollow="false"
      data-expandifr="true"
      data-scale="100"
      data-clutchcompany-id={CLUTCH_COMPANY_ID}
    />
  </div>;
}
