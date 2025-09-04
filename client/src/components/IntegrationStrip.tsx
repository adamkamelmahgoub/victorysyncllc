
import { site } from "../content/site";

export default function IntegrationStrip() {
  return (
    <section className="py-10 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-slate-600">Works with your stack</p>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          {site.integrations.map(name => (
            <span key={name} className="rounded-full border px-3 py-1 text-xs bg-white">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
