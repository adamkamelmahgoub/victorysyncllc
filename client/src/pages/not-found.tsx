import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center bg-[#f5f7fc] px-5 py-20">
      <div className="max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/10">
          <AlertCircle className="h-8 w-8 text-violet-700" aria-hidden="true" />
        </div>
        <h1 className="mb-3 text-4xl font-bold text-slate-950">Page not found</h1>
        <p className="mx-auto mb-8 max-w-sm text-slate-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <nav aria-label="Helpful pages" className="flex flex-wrap justify-center gap-3">
          {[
            ['Home', '/'], ['Services', '/services'], ['Pricing', '/pricing'], ['Contact', '/contact'],
          ].map(([label, href]) => <Link key={href} href={href} className="rounded-lg border border-violet-300/50 bg-white px-4 py-2 font-semibold text-violet-800 hover:bg-violet-50">{label}</Link>)}
        </nav>
      </div>
    </div>
  );
}
