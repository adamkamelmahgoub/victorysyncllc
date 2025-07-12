
import { useEffect } from 'react';
import { useLocation } from 'wouter';

const ScrollToTop: React.FC = () => {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const handleAnchorClick = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        setTimeout(() => window.scrollTo(0, 0), 100);
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return null;
};

export default ScrollToTop;
