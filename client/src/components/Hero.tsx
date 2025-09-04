
import { site } from "../content/site";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            AI-powered contact center, managed for you
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            24/7 inbound & outbound, faster responses, happier customers—at up to 60% lower cost.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={site.ctas.primary.href} className="rounded-xl bg-primary px-5 py-3 text-white hover:bg-primary-600 transition">
              {site.ctas.primary.label}
            </a>
            <a href={site.ctas.secondary.href} className="rounded-xl border px-5 py-3 hover:bg-slate-50 transition">
              {site.ctas.secondary.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
