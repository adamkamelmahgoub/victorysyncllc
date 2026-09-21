import { Link } from 'wouter';

type RelatedLink = { label: string; href: string };

export default function ServiceNextSteps({ related = [] }: { related?: RelatedLink[] }) {
  return <aside className="border-y border-slate-200 bg-slate-50 px-5 py-10" aria-label="Related services and next steps">
    <div className="mx-auto max-w-5xl">
      <h2 className="text-xl font-bold text-slate-900">Explore next steps</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href="/book-call" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Book a call</Link>
        {related.map(({ label, href }) => <Link key={href} href={href} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50">{label}</Link>)}
      </div>
    </div>
  </aside>;
}
