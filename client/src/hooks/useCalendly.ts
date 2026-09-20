import { useCallback } from 'react';

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

export const CALENDLY_URL = 'https://calendly.com/adam-victorysync/victorysync-consultation';

export function loadCalendlyAssets(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Calendly) {
      resolve();
      return;
    }

    if (!document.querySelector('link[rel="stylesheet"][href="https://assets.calendly.com/assets/external/widget.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(link);
    }

    if (!document.querySelector('script[src*="calendly.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Calendly widget'));
      document.head.appendChild(script);
    } else {
      const existing = document.querySelector('script[src*="calendly.com"]') as HTMLScriptElement;
      existing.addEventListener('load', () => resolve());
    }
  });
}

export function useCalendly() {
  const open = useCallback(async () => {
    try {
      await loadCalendlyAssets();
      if (!window.Calendly) throw new Error('Calendly widget unavailable');
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } catch (err) {
      console.warn('Calendly widget failed to load - opening booking page', err);
      window.location.href = CALENDLY_URL;
    }
  }, []);

  return { open };
}
