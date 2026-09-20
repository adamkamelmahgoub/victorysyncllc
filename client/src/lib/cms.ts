export type ElementEdit = {
  text?: string;
  textNodes?: Record<string, string>;
  src?: string;
  alt?: string;
  href?: string;
  style?: string;
  className?: string;
  attributes?: Record<string, string>;
  hidden?: boolean;
};

export type SeoEdit = { title?: string; description?: string; canonical?: string };
export type CmsBlock = {
  id: string;
  heading: string;
  body: string;
  image?: string;
  imageAlt?: string;
  buttonText?: string;
  buttonUrl?: string;
  background?: string;
};
export type CmsContent = {
  version: 1;
  elements: Record<string, ElementEdit>;
  seo: Record<string, SeoEdit>;
  blocks: Record<string, CmsBlock[]>;
};

export const emptyContent = (): CmsContent => ({ version: 1, elements: {}, seo: {}, blocks: {} });
export const CMS_OWNER = 'adamkamelmahgoub';
export const CMS_REPO = 'victorysyncllc';
export const CMS_FILE = 'client/public/cms/content.json';
export const CMS_ADMIN_GITHUB_ID = 243559865;

export function editableAttributes(element: Element): Record<string, string> {
  const result: Record<string, string> = {};
  for (const attribute of Array.from(element.attributes)) {
    if (/^(title|placeholder|aria-[\w-]+|data-[\w-]+|name|value|target|rel|width|height|loading|type|role|id)$/i.test(attribute.name)) {
      result[attribute.name] = attribute.value;
    }
  }
  return result;
}

export function safeAttribute(name: string, value: string): boolean {
  if (!/^(title|placeholder|aria-[\w-]+|data-[\w-]+|name|value|target|rel|width|height|loading|type|role|id)$/i.test(name)) return false;
  if ((name === 'target' && !['_self', '_blank', '_parent', '_top'].includes(value)) || (name === 'type' && !/^[\w-]+$/.test(value))) return false;
  return true;
}

export function safeUrl(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  return !/^(javascript|data|vbscript):/.test(trimmed);
}

export function selectorFor(element: Element): string {
  const parts: string[] = [];
  let current: Element | null = element;
  while (current && current.id !== 'root') {
    const parent: Element | null = current.parentElement;
    if (!parent) break;
    const tag = current.tagName.toLowerCase();
    const sameTag = Array.from(parent.children).filter((child) => child.tagName === current!.tagName);
    parts.unshift(`${tag}:nth-of-type(${sameTag.indexOf(current) + 1})`);
    current = parent;
  }
  return `#root > ${parts.join(' > ')}`;
}

export function elementKey(element: Element, route = window.location.pathname): string {
  const scope = element.closest('nav, footer') ? 'global' : route;
  return `${scope}|${selectorFor(element)}`;
}

export function firstTextNode(element: Element): Text | undefined {
  const nodes = Array.from(element.childNodes).filter((node): node is Text => node.nodeType === Node.TEXT_NODE);
  return nodes.find((node) => Boolean(node.textContent?.trim())) || nodes.find((node) => node.textContent === '');
}

export function applyCms(content: CmsContent, route = window.location.pathname): void {
  const blockHost = document.getElementById('cms-blocks');
  if (blockHost) {
    const blocks = content.blocks?.[route] || [];
    const signature = JSON.stringify(blocks);
    if (blockHost.dataset.cmsSignature !== signature) {
      blockHost.replaceChildren(...blocks.map((block) => {
        const section = document.createElement('section');
        section.className = 'px-6 py-16';
        section.style.background = block.background || '#f8fafc';
        const inner = document.createElement('div');
        inner.className = 'max-w-5xl mx-auto';
        const heading = document.createElement('h2');
        heading.className = 'text-3xl font-bold mb-5';
        heading.textContent = block.heading;
        inner.appendChild(heading);
        if (block.image && safeUrl(block.image)) {
          const img = document.createElement('img');
          img.src = block.image;
          img.alt = block.imageAlt || '';
          img.loading = 'lazy';
          img.className = 'rounded-xl max-w-full h-auto mb-6';
          inner.appendChild(img);
        }
        const body = document.createElement('p');
        body.className = 'text-lg leading-relaxed whitespace-pre-line';
        body.textContent = block.body;
        inner.appendChild(body);
        if (block.buttonText && block.buttonUrl && safeUrl(block.buttonUrl)) {
          const button = document.createElement('a');
          button.className = 'inline-block mt-6 rounded-lg bg-cyan-500 px-6 py-3 font-bold text-slate-950';
          button.href = block.buttonUrl;
          button.textContent = block.buttonText;
          inner.appendChild(button);
        }
        section.appendChild(inner);
        return section;
      }));
      blockHost.dataset.cmsSignature = signature;
    }
  }
  for (const [key, edit] of Object.entries(content.elements || {})) {
    const separator = key.indexOf('|');
    if (separator === -1) continue;
    const scope = key.slice(0, separator);
    if (scope !== 'global' && scope !== route) continue;
    const selector = key.slice(separator + 1);
    let element: HTMLElement | null;
    try { element = document.querySelector<HTMLElement>(selector); } catch { continue; }
    if (!element) continue;
    const text = firstTextNode(element);
    if (text && edit.text !== undefined && text.textContent !== edit.text) text.textContent = edit.text;
    if (edit.textNodes) {
      const nodes = Array.from(element.childNodes).filter((node): node is Text => node.nodeType === Node.TEXT_NODE);
      for (const [index, value] of Object.entries(edit.textNodes)) {
        const node = nodes[Number(index)];
        if (node && node.textContent !== value) node.textContent = value;
      }
    }
    if (element instanceof HTMLImageElement) {
      if (edit.src !== undefined && safeUrl(edit.src) && element.getAttribute('src') !== edit.src) element.setAttribute('src', edit.src);
      if (edit.alt !== undefined && element.alt !== edit.alt) element.alt = edit.alt;
    }
    if (element instanceof HTMLAnchorElement && edit.href !== undefined && safeUrl(edit.href) && element.getAttribute('href') !== edit.href) {
      element.setAttribute('href', edit.href);
    }
    if (edit.className !== undefined && element.className !== edit.className) element.className = edit.className;
    if (edit.attributes) {
      for (const [name, value] of Object.entries(edit.attributes)) {
        if (!safeAttribute(name, value)) continue;
        if (element.getAttribute(name) !== value) element.setAttribute(name, value);
      }
    }
    if (edit.style !== undefined && element.getAttribute('style') !== edit.style) element.setAttribute('style', edit.style);
    if (edit.hidden !== undefined && element.hidden !== edit.hidden) element.hidden = edit.hidden;
  }
  const seo = content.seo?.[route];
  if (!seo) return;
  if (seo.title && document.title !== seo.title) document.title = seo.title;
  for (const [name, value] of ([
    ['description', seo.description], ['og:title', seo.title], ['og:description', seo.description],
    ['twitter:title', seo.title], ['twitter:description', seo.description],
  ] as Array<[string, string | undefined]>)) {
    if (!value) continue;
    const attribute = name.startsWith('og:') ? 'property' : 'name';
    let meta = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    if (meta.content !== value) meta.content = value;
  }
  if (seo.canonical) {
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical && canonical.href !== seo.canonical) canonical.href = seo.canonical;
    const ogUrl = document.head.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (ogUrl && ogUrl.content !== seo.canonical) ogUrl.content = seo.canonical;
  }
}

export function safeContent(input: unknown): CmsContent {
  if (!input || typeof input !== 'object') return emptyContent();
  const value = input as Partial<CmsContent>;
  return {
    version: 1,
    elements: value.elements && typeof value.elements === 'object' ? value.elements : {},
    seo: value.seo && typeof value.seo === 'object' ? value.seo : {},
    blocks: value.blocks && typeof value.blocks === 'object' ? value.blocks : {},
  };
}
