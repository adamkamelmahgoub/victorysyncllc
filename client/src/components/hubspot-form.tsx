import { useEffect, useRef } from 'react';

const SCRIPT_URL = 'https://js-eu1.hsforms.net/forms/embed/149614201.js';

export function HubSpotForm() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // HubSpot's embed script scans for this element when it loads. Reinsert it
    // on each mount so client-side navigation also renders the form.
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.defer = true;
    containerRef.current.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div ref={containerRef}>
      <div
        className="hs-form-frame"
        data-region="eu1"
        data-form-id="c6a081d5-44c4-469f-832d-a795a71a6956"
        data-portal-id="149614201"
      />
    </div>
  );
}
