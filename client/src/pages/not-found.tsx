import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center bg-white px-5 py-20">
      <div className="max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
          <AlertCircle className="h-8 w-8 text-blue-600" aria-hidden="true" />
        </div>
        <h1 className="mb-3 text-4xl font-bold text-slate-950">Page not found</h1>
        <p className="mx-auto mb-8 max-w-sm text-slate-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <nav aria-label="Helpful pages" className="flex flex-wrap justify-center gap-3">
          {[
            ['Home', '/'], ['Services', '/services'], ['Pricing', '/pricing'], ['Contact', '/contact'],
          ].map(([label, href]) => <Link key={href} href={href} className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50">{label}</Link>)}
        </nav>
      </div>
    </div>
  );
}
