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

export function useCalendly() {
  const open = useCallback(() => {
    const calendlyUrl = import.meta.env.VITE_CALENDLY_URL;
    
    if (!calendlyUrl) {
      console.warn('VITE_CALENDLY_URL is not configured - redirecting to contact page');
      window.location.href = '/contact';
      return;
    }

    if (typeof window !== 'undefined' && window.Calendly) {
      window.Calendly.initPopupWidget({ url: calendlyUrl });
    } else {
      console.warn('Calendly widget not loaded yet - redirecting to contact page');
      window.location.href = '/contact';
    }
  }, []);

  return { open };
}
