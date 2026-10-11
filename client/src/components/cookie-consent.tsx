import { useEffect, useState } from 'react';
import { loadMarketingAnalytics } from '@/lib/analytics';

type Choice = 'accepted' | 'rejected';
const key = 'vs-cookie-consent-v1';
const hasGpc = () => Boolean((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl);

export default function CookieConsent() {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [settings, setSettings] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem(key) as Choice | null;
    setChoice(hasGpc() ? 'rejected' : saved);
    if (saved === 'accepted' && !hasGpc()) loadMarketingAnalytics();
    const open = () => setSettings(true);
    window.addEventListener('vs:privacy-settings', open);
    return () => window.removeEventListener('vs:privacy-settings', open);
  }, []);
  const save = (value: Choice) => { localStorage.setItem(key, value); setChoice(value); setSettings(false); if (value === 'accepted' && !hasGpc()) loadMarketingAnalytics(); else { window.fbq?.('consent', 'revoke'); window.gtag?.('consent', 'update', { ad_storage: 'denied', analytics_storage: 'denied' }); } };
  if (choice && !settings) return null;
  return <div className="vs-consent" role="dialog" aria-label="Cookie choices"><div><strong>{settings ? 'Your Privacy Choices' : 'Your privacy matters'}</strong><p>{hasGpc() ? 'Your browser has Global Privacy Control enabled. Advertising and analytics cookies are off.' : 'Choose whether VictorySync can use optional analytics and advertising cookies. Essential site functions remain available.'}</p></div><div className="vs-consent-actions"><button type="button" onClick={() => save('rejected')}>Reject non-essential</button>{!hasGpc() && <button type="button" onClick={() => save('accepted')}>Accept</button>}{!settings && <button type="button" onClick={() => setSettings(true)}>Settings</button>}{settings && choice && <button type="button" onClick={() => setSettings(false)}>Close</button>}</div></div>;
}
