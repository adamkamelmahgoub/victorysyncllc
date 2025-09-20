
import { useEffect } from "react";

export default function CrispLoader({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;
    (window as any).$crisp = [];
    (window as any).CRISP_WEBSITE_ID = import.meta.env.VITE_CRISP_ID;
    const s = document.createElement("script");
    s.src = "https://client.crisp.chat/l.js"; s.async = true;
    document.body.appendChild(s);
    return () => { s.remove(); };
  }, [enabled]);
  return null;
}
