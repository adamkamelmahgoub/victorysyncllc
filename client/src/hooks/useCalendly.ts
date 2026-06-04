import { useCallback } from 'react';

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

interface ImportMetaEnv {
  readonly VITE_CALENDLY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export function loadCalendlyAssets(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Calendly) {
      resolve();
      return;
    }

    if (!document.querySelector('link[href*="calendly.com"]')) {
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
    const calendlyUrl = import.meta.env.VITE_CALENDLY_URL;

    if (!calendlyUrl) {
      console.warn('VITE_CALENDLY_URL is not configured - redirecting to contact page');
      window.location.href = '/contact';
      return;
    }

    try {
      await loadCalendlyAssets();
      window.Calendly?.initPopupWidget({ url: calendlyUrl });
    } catch (err) {
      console.warn('Calendly widget failed to load - redirecting to contact page', err);
      window.location.href = '/contact';
    }
  }, []);

  return { open };
}
