import { useEffect, useRef, useState } from 'react';
import { CMS_ADMIN_GITHUB_ID, CMS_FILE, CMS_OWNER, CMS_REPO, emptyContent, safeAttribute, safeContent, safeUrl, type CmsBlock, type CmsContent, type ElementEdit, type SeoEdit } from '@/lib/cms';

const pages = [
  '/', '/services', '/inbound-support', '/appointment-setting', '/cold-calling', '/ai-automation',
  '/pricing', '/platform', '/about-us', '/contact', '/book-call', '/help-center',
  '/privacy-policy', '/terms', '/appointment-setting-for-home-services', '/cold-calling-for-plumbers',
  '/appointment-setting-for-real-estate', '/inbound-support-for-law-firms',
  '/dashboard',
];
const api = `https://api.github.com/repos/${CMS_OWNER}/${CMS_REPO}`;
const fileApi = `${api}/contents/${CMS_FILE}`;
const draftKey = 'victorysync-cms-draft-v1';

function encodeBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  }
  return btoa(binary);
}

function decodeBase64(value: string): string {
  const binary = atob(value.replace(/\s/g, ''));
  return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
}

type Selection = {
  key: string; tag: string; text: string; textNodes: string[]; src?: string; alt?: string; href?: string; style: string;
  className: string; attributes: Record<string, string>;
};

export default function CmsPage() {
  const [token, setToken] = useState('');
  const [connected, setConnected] = useState(false);
  const [route, setRoute] = useState('/');
  const [content, setContent] = useState<CmsContent>(emptyContent);
  const [published, setPublished] = useState<CmsContent>(emptyContent);
  const [sha, setSha] = useState('');
  const [selection, setSelection] = useState<Selection | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<'content' | 'sections' | 'seo' | 'media'>('content');
  const [frameVersion, setFrameVersion] = useState(0);
  const [attributeError, setAttributeError] = useState('');
  const frame = useRef<HTMLIFrameElement>(null);

  const github = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token.trim()}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || `GitHub returned ${response.status}`);
    return data;
  };

  const connect = async () => {
    setBusy(true);
    setMessage('Connecting to GitHub…');
    try {
      const user = await github('https://api.github.com/user');
      if (user.id !== CMS_ADMIN_GITHUB_ID) throw new Error('This CMS is restricted to the VictorySync owner account.');
      const repo = await github(api);
      if (!repo.permissions?.push) throw new Error('This token needs Contents: read and write access to the VictorySync repository.');
      const file = await github(`${fileApi}?ref=main`);
      const remote = safeContent(JSON.parse(decodeBase64(file.content)));
      setSha(file.sha);
      setPublished(remote);
      const saved = localStorage.getItem(draftKey);
      setContent(saved ? safeContent(JSON.parse(saved)) : remote);
      setConnected(true);
      setMessage(saved ? 'Connected. Your saved draft is loaded.' : 'Connected. Select a page and click its content to edit.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not connect.');
    } finally { setBusy(false); }
  };

  useEffect(() => {
    if (!connected) return;
    if (JSON.stringify(content) === JSON.stringify(published)) localStorage.removeItem(draftKey);
    else localStorage.setItem(draftKey, JSON.stringify(content));
    frame.current?.contentWindow?.postMessage({ type: 'CMS_PREVIEW', content }, window.location.origin);
  }, [content, published, connected, route]);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === 'CMS_READY') {
        frame.current?.contentWindow?.postMessage({ type: 'CMS_PREVIEW', content }, window.location.origin);
      }
      if (event.data?.type === 'CMS_SELECT') { setSelection(event.data as Selection); setTab('content'); }
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [content]);

  const changeElement = (patch: Partial<ElementEdit>) => {
    if (!selection) return;
    setContent((current) => ({
      ...current,
      elements: { ...current.elements, [selection.key]: { ...current.elements[selection.key], ...patch } },
    }));
  };
  const changeAttribute = (name: string, value: string) => {
    if (!safeAttribute(name, value)) { setAttributeError('That attribute or value is not supported.'); return; }
    setAttributeError('');
    changeElement({ attributes: { ...(selection?.attributes || {}), ...(selection ? content.elements[selection.key]?.attributes : {}), [name]: value } });
  };
  const changeSeo = (patch: Partial<SeoEdit>) => setContent((current) => ({
    ...current, seo: { ...current.seo, [route]: { ...current.seo[route], ...patch } },
  }));
  const changeBlocks = (blocks: CmsBlock[]) => setContent((current) => ({
    ...current, blocks: { ...current.blocks, [route]: blocks },
  }));
  const updateBlock = (id: string, patch: Partial<CmsBlock>) => changeBlocks((content.blocks[route] || []).map((block) => block.id === id ? { ...block, ...patch } : block));
  const moveBlock = (index: number, by: number) => {
    const blocks = [...(content.blocks[route] || [])];
    const next = index + by;
    if (next < 0 || next >= blocks.length) return;
    [blocks[index], blocks[next]] = [blocks[next], blocks[index]];
    changeBlocks(blocks);
  };

  const publish = async () => {
    setBusy(true);
    setMessage('Publishing…');
    try {
      const file = await github(`${fileApi}?ref=main`);
      if (file.sha !== sha) throw new Error('Someone changed the published content. Reload the CMS before publishing to avoid overwriting their work.');
      const result = await github(fileApi, {
        method: 'PUT',
        body: JSON.stringify({
          message: 'Update VictorySync website content via CMS',
          content: encodeBase64(`${JSON.stringify(content, null, 2)}\n`),
          sha,
          branch: 'main',
        }),
      });
      setSha(result.content.sha);
      setPublished(content);
      localStorage.removeItem(draftKey);
      setMessage('Published to GitHub. Vercel is rebuilding the website; changes usually appear within a few minutes.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Publish failed.');
    } finally { setBusy(false); }
  };

  const upload = async (file: File) => {
    if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) { setMessage('Choose a PNG, JPEG, WebP, or GIF image.'); return; }
    if (file.size > 4_000_000) { setMessage('Choose an image under 4 MB.'); return; }
    setBusy(true);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      let binary = '';
      for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
      const name = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
      const path = `client/public/cms/uploads/${name}`;
      await github(`${api}/contents/${path}`, {
        method: 'PUT',
        body: JSON.stringify({ message: `Upload CMS image ${name}`, content: btoa(binary), branch: 'main' }),
      });
      const url = `/cms/uploads/${name}`;
      if (selection?.tag === 'img') changeElement({ src: url });
      setMessage(`Uploaded ${url}. Publish your content draft to use it on the site.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Upload failed.'); }
    finally { setBusy(false); }
  };

  const edit = selection ? content.elements[selection.key] || {} : {};
  const seo = content.seo[route] || {};
  const changed = JSON.stringify(content) !== JSON.stringify(published);

  if (!connected) return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-8 space-y-5">
        <div className="text-sm font-semibold tracking-widest text-cyan-400">VICTORYSYNC</div>
        <h1 className="text-3xl font-bold">Website CMS</h1>
        <p className="text-slate-300">This private editor accepts only the VictorySync owner GitHub account. Create a fine grained token for this repository with Contents read and write permission. The token stays in this browser tab.</p>
        <label className="block text-sm font-semibold" htmlFor="github-token">GitHub token</label>
        <input id="github-token" type="password" autoComplete="off" value={token} onChange={(event) => setToken(event.target.value)} className="w-full rounded-lg bg-slate-800 border border-slate-600 px-4 py-3" />
        <button disabled={!token.trim() || busy} onClick={connect} className="w-full rounded-lg bg-cyan-500 text-slate-950 font-bold px-4 py-3 disabled:opacity-50">Connect to CMS</button>
        <p role="status" className="text-sm text-slate-300">{message}</p>
        <a className="text-cyan-400 text-sm underline" href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer">Create a fine grained token on GitHub</a>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <header className="flex flex-wrap gap-3 items-center justify-between border-b border-slate-700 px-5 py-3">
        <div><div className="text-xs font-bold tracking-widest text-cyan-400">VICTORYSYNC</div><h1 className="text-xl font-bold">Website CMS</h1></div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">{changed ? 'Unpublished changes' : 'All changes published'}</span>
          <button onClick={() => { setContent(published); localStorage.removeItem(draftKey); setSelection(null); setFrameVersion((value) => value + 1); setMessage('Draft discarded.'); }} disabled={!changed || busy} className="rounded-lg border border-slate-600 px-4 py-2 disabled:opacity-40">Discard draft</button>
          <button onClick={publish} disabled={!changed || busy} className="rounded-lg bg-cyan-500 text-slate-950 font-bold px-4 py-2 disabled:opacity-40">Publish changes</button>
        </div>
      </header>
      <div className="flex-1 grid lg:grid-cols-[220px_minmax(0,1fr)_340px] min-h-0">
        <aside className="border-r border-slate-700 p-4 overflow-y-auto">
          <h2 className="font-semibold mb-3">Pages</h2>
          <nav aria-label="CMS pages" className="space-y-1">
            {pages.map((path) => <button key={path} onClick={() => { setRoute(path); setSelection(null); setFrameVersion((value) => value + 1); }} className={`block w-full text-left text-sm rounded-lg px-3 py-2 break-words ${route === path ? 'bg-cyan-500 text-slate-950 font-semibold' : 'hover:bg-slate-800 text-slate-300'}`}>{path === '/' ? 'Home' : path.slice(1).replace(/-/g, ' ')}</button>)}
          </nav>
        </aside>
        <section className="bg-slate-800 p-3 min-h-[70vh]" aria-label="Live page preview">
          <iframe key={frameVersion} ref={frame} title={`Preview of ${route}`} src={`${route}?cmsEdit=1`} className="w-full h-full min-h-[70vh] bg-white rounded-lg" />
        </section>
        <aside className="border-l border-slate-700 p-5 overflow-y-auto space-y-4">
          <div className="flex gap-2 border-b border-slate-700 pb-3">
            {(['content', 'sections', 'seo', 'media'] as const).map((name) => <button key={name} onClick={() => setTab(name)} className={`rounded-lg px-3 py-2 capitalize text-sm ${tab === name ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800'}`}>{name}</button>)}
          </div>
          {tab === 'content' && (!selection ? <p className="text-slate-300">Click any element in the preview. Hold Alt while clicking to select its exact container. Edit its text, image, link, styles, classes, and attributes.</p> : <>
            <h2 className="font-semibold">Editing {selection.tag}</h2>
            <p className="text-xs text-slate-500 break-all">{selection.key}</p>
            {selection.textNodes.map((value, index) => <Field key={`${selection.key}-${index}`} label={`Text ${index + 1}`} value={edit.textNodes?.[index] ?? value} multiline onChange={(next) => changeElement({ textNodes: { ...(edit.textNodes || {}), [index]: next } })} />)}
            {selection.tag === 'img' && <><Field label="Image URL" value={edit.src ?? selection.src ?? ''} onChange={(value) => safeUrl(value) ? changeElement({ src: value }) : setMessage('This image URL is not allowed.')} /><Field label="Alt text" value={edit.alt ?? selection.alt ?? ''} onChange={(value) => changeElement({ alt: value })} /></>}
            {selection.tag === 'a' && <Field label="Link URL" value={edit.href ?? selection.href ?? ''} onChange={(value) => safeUrl(value) ? changeElement({ href: value }) : setMessage('This link URL is not allowed.')} />}
            <Field label="Custom CSS styles" value={edit.style ?? selection.style} multiline onChange={(value) => changeElement({ style: value })} />
            <Field label="CSS classes" value={edit.className ?? selection.className} multiline onChange={(value) => changeElement({ className: value })} />
            <h3 className="font-semibold">Element attributes</h3>
            {Object.entries({ ...selection.attributes, ...edit.attributes }).map(([name, value]) => <Field key={name} label={name} value={value} onChange={(next) => changeAttribute(name, next)} />)}
            <div className="flex gap-2"><input id="new-attribute-name" aria-label="New attribute name" placeholder="Attribute name" className="min-w-0 flex-1 rounded-lg bg-slate-800 border border-slate-600 px-2" /><button className="rounded-lg bg-slate-700 px-3 py-2" onClick={() => { const input = document.getElementById('new-attribute-name') as HTMLInputElement; if (input?.value) { changeAttribute(input.value.trim(), ''); input.value = ''; } }}>Add</button></div>
            {attributeError && <p className="text-sm text-red-300">{attributeError}</p>}
            <label className="flex gap-2 items-center text-sm"><input type="checkbox" checked={Boolean(edit.hidden)} onChange={(event) => changeElement({ hidden: event.target.checked })} /> Hide this element</label>
            <button className="text-sm text-cyan-400 underline" onClick={() => { const next = { ...content.elements }; delete next[selection.key]; setContent({ ...content, elements: next }); setSelection(null); setFrameVersion((value) => value + 1); setMessage('This element is reset in the draft.'); }}>Reset this element</button>
          </>)}
          {tab === 'sections' && <>
            <h2 className="font-semibold">Additional sections on {route}</h2>
            <p className="text-sm text-slate-300">Add, edit, reorder, or remove sections below the page's existing content.</p>
            {(content.blocks[route] || []).map((block, index) => <div key={block.id} className="border border-slate-700 rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between"><strong>Section {index + 1}</strong><div className="flex gap-2"><button onClick={() => moveBlock(index, -1)} aria-label="Move section up">↑</button><button onClick={() => moveBlock(index, 1)} aria-label="Move section down">↓</button><button onClick={() => changeBlocks((content.blocks[route] || []).filter((item) => item.id !== block.id))} className="text-red-300">Delete</button></div></div>
              <Field label="Heading" value={block.heading} onChange={(value) => updateBlock(block.id, { heading: value })} />
              <Field label="Body" value={block.body} multiline onChange={(value) => updateBlock(block.id, { body: value })} />
              <Field label="Image URL" value={block.image || ''} onChange={(value) => updateBlock(block.id, { image: value })} />
              <Field label="Image alt text" value={block.imageAlt || ''} onChange={(value) => updateBlock(block.id, { imageAlt: value })} />
              <Field label="Button text" value={block.buttonText || ''} onChange={(value) => updateBlock(block.id, { buttonText: value })} />
              <Field label="Button URL" value={block.buttonUrl || ''} onChange={(value) => updateBlock(block.id, { buttonUrl: value })} />
              <Field label="Background color" value={block.background || ''} onChange={(value) => updateBlock(block.id, { background: value })} />
            </div>)}
            <button onClick={() => changeBlocks([...(content.blocks[route] || []), { id: crypto.randomUUID(), heading: 'New section', body: 'Add your content here.' }])} className="w-full rounded-lg bg-slate-800 border border-slate-600 px-4 py-2">Add section</button>
          </>}
          {tab === 'seo' && <>
            <h2 className="font-semibold">Search metadata for {route}</h2>
            <Field label="Page title" value={seo.title ?? ''} onChange={(value) => changeSeo({ title: value })} />
            <Field label="Meta description" value={seo.description ?? ''} multiline onChange={(value) => changeSeo({ description: value })} />
            <p className="text-xs text-slate-400">Leave a field blank to use the page default. Social titles and descriptions follow these fields. Canonical URLs stay tied to the page URL.</p>
          </>}
          {tab === 'media' && <>
            <h2 className="font-semibold">Upload an image</h2>
            <p className="text-sm text-slate-300">Select an image in the preview first to replace it automatically. Uploads are committed to the site repository and deploy with Vercel.</p>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} className="block w-full text-sm" />
          </>}
        </aside>
      </div>
      <footer className="border-t border-slate-700 px-5 py-3 text-sm text-slate-300" role="status">{message} <a href={`https://github.com/${CMS_OWNER}/${CMS_REPO}/commits/main/${CMS_FILE}`} target="_blank" rel="noreferrer" className="text-cyan-400 underline ml-2">Content history</a></footer>
    </main>
  );
}

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return <label className="block text-sm font-semibold space-y-2">{label}{multiline ?
    <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="block w-full rounded-lg bg-slate-800 border border-slate-600 px-3 py-2 font-normal" /> :
    <input value={value} onChange={(event) => onChange(event.target.value)} className="block w-full rounded-lg bg-slate-800 border border-slate-600 px-3 py-2 font-normal" />}</label>;
}
