import ReactMarkdown from 'react-markdown';
import { useSeo } from '@/hooks/useSeo';
import LegalToc, { legalHeadingId, legalHeadings } from './legal-toc';

export default function LegalDocument({ markdown, title, description, path }: { markdown: string; title: string; description: string; path: string }) {
  useSeo({ title, description, canonical: `https://www.victorysync.com${path}` });
  const headings = legalHeadings(markdown);
  const Heading = ({ level, children }: { level: 1 | 2 | 3; children: React.ReactNode }) => {
    const label = String(children);
    const id = legalHeadingId(label);
    const content = <>{children}<a href={`#${id}`} className="vs-legal-anchor" aria-label={`Link to ${label}`}>#</a></>;
    if (level === 1) return <h1 id={id}>{content}</h1>;
    if (level === 2) return <h2 id={id}>{content}</h2>;
    return <h3 id={id}>{content}</h3>;
  };
  return <div className="vs-legal vs-legal-page"><LegalToc headings={headings} /><div className="vs-legal-content prose prose-invert"><ReactMarkdown components={{ h1: ({ children }) => <Heading level={1}>{children}</Heading>, h2: ({ children }) => <Heading level={2}>{children}</Heading>, h3: ({ children }) => <Heading level={3}>{children}</Heading> }}>{markdown}</ReactMarkdown></div></div>;
}
