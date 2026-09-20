import { useEffect } from 'react';
import { applyCms, editableAttributes, elementKey, emptyContent, firstTextNode, safeContent, type CmsContent } from '@/lib/cms';

declare global {
  interface Window { __CMS_READY__?: boolean }
}

export default function CmsRuntime() {
  useEffect(() => {
    if (window.location.pathname === '/cms') return;
    const editor = new URLSearchParams(window.location.search).has('cmsEdit');
    let content: CmsContent = emptyContent();
    let selected: HTMLElement | null = null;
    let applying = false;
    const render = () => {
      if (applying) return;
      applying = true;
      applyCms(content);
      applying = false;
    };
    const observer = new MutationObserver(() => render());
    const headObserver = new MutationObserver(() => render());
    const root = document.getElementById('root');
    if (root) observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true });
    headObserver.observe(document.head, { childList: true, subtree: true, characterData: true, attributes: true });

    const onMessage = (event: MessageEvent) => {
      if (!editor || event.origin !== window.location.origin || event.data?.type !== 'CMS_PREVIEW') return;
      content = safeContent(event.data.content);
      render();
    };
    const onClick = (event: MouseEvent) => {
      if (!editor) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      event.preventDefault();
      event.stopPropagation();
      let element: Element | null = target;
      if (!event.altKey) {
        while (element && element.id !== 'root' && !(element instanceof HTMLImageElement) &&
          !(element instanceof HTMLAnchorElement) && !firstTextNode(element)) element = element.parentElement;
      }
      if (!(element instanceof HTMLElement) || element.id === 'root') return;
      if (selected) selected.style.outline = '';
      const originalStyle = element.getAttribute('style') || '';
      selected = element;
      selected.style.outline = '3px solid #06b6d4';
      const textNodes = Array.from(element.childNodes)
        .filter((node): node is Text => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent || '');
      window.parent.postMessage({
        type: 'CMS_SELECT', key: elementKey(element), tag: element.tagName.toLowerCase(),
        text: firstTextNode(element)?.textContent || '',
        textNodes,
        src: element instanceof HTMLImageElement ? element.getAttribute('src') || '' : undefined,
        alt: element instanceof HTMLImageElement ? element.alt : undefined,
        href: element instanceof HTMLAnchorElement ? element.getAttribute('href') || '' : undefined,
        style: originalStyle,
        className: element.className,
        attributes: editableAttributes(element),
      }, window.location.origin);
    };
    window.addEventListener('message', onMessage);
    document.addEventListener('click', onClick, true);
    fetch('/cms/content.json', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : emptyContent())
      .then((data) => { content = safeContent(data); render(); })
      .catch(() => { render(); })
      .finally(() => {
        window.__CMS_READY__ = true;
        if (editor) window.parent.postMessage({ type: 'CMS_READY' }, window.location.origin);
      });
    return () => {
      observer.disconnect();
      headObserver.disconnect();
      window.removeEventListener('message', onMessage);
      document.removeEventListener('click', onClick, true);
    };
  }, []);
  return null;
}
