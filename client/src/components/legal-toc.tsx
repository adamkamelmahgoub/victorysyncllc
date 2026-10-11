type Heading = { id: string; label: string; level: number };

export function legalHeadingId(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function legalHeadings(markdown: string): Heading[] {
  return markdown.split('\n').flatMap(line => {
    const match = /^(#{1,3})\s+(.+)$/.exec(line.trim());
    return match ? [{ id: legalHeadingId(match[2]), label: match[2], level: match[1].length }] : [];
  });
}

export default function LegalToc({ headings }: { headings: Heading[] }) {
  return <aside className="vs-legal-toc"><strong>On this page</strong><nav aria-label="Legal page sections">{headings.filter(heading => heading.level === 2).map(heading => <a key={heading.id} href={`#${heading.id}`}>{heading.label}</a>)}</nav></aside>;
}
