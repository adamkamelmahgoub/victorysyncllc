import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
}

export function useSeo({ title, description, canonical, ogImage }: SeoProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (link) link.href = canonical;
      setMeta('meta[property="og:url"]', 'content', canonical);
    }

    if (ogImage) {
      setMeta('meta[property="og:image"]', 'content', ogImage);
      setMeta('meta[name="twitter:image"]', 'content', ogImage);
    }
  }, [title, description, canonical, ogImage]);
}
