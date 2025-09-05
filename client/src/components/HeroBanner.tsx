
import React from "react";

type CTA = { label: string; to: string; variant?: "primary" | "outline" };

export default function HeroBanner({
  eyebrow,
  title,
  accent,
  subtitle,
  ctas = [],
  rightPanel = true,
  image,
  imageAlt
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  subtitle?: string;
  ctas?: CTA[];
  rightPanel?: boolean;
  image?: string;     // optional external/public image; if missing, we render an animated panel
  imageAlt?: string;
}) {
  return (
    <section className="hero-wrap">
      <div className="hero-bg" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            {eyebrow && <span className="vs-eyebrow">{eyebrow}</span>}
            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold leading-tight">
              {title} {accent && <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-violet-600">{accent}</span>}
            </h1>
            {subtitle && (
              <p className="mt-4 text-slate-600 max-w-xl text-lg">{subtitle}</p>
            )}
            {ctas.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {ctas.map((c) => (
                  <a
                    key={c.label}
                    href={c.to}
                    className={
                      c.variant === "outline"
                        ? "rounded-lg border border-slate-200 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
                        : "btn-shine rounded-lg px-5 py-2.5 font-semibold shadow-sm text-white"
                    }
                  >
                    {c.label}
                  </a>
                ))}
              </div>
            )}
            {/* quick stats line */}
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md text-center">
              {[
                ["Cost savings", "60%"],
                ["First reply", "<60s"],
                ["Coverage", "24/7"]
              ].map(([k, v], i) => (
                <div key={i} className="glass rounded-xl border border-slate-100 bg-white/70 p-3">
                  <div className="text-xs text-slate-500">{k}</div>
                  <div className="text-lg font-bold">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {rightPanel && (
            <div className="relative">
              {image ? (
                <img
                  src={image}
                  alt={imageAlt || ""}
                  className="hero-img reveal reveal-fade is-visible"
                />
              ) : (
                <div className="hero-panel reveal reveal-right is-visible">
                  <div className="hero-panel-grid" />
                  <div className="hero-badge">Agent console</div>
                  <div className="hero-chip" style={{ top: 26, left: 26 }} />
                  <div className="hero-chip" style={{ top: 80, right: 40 }} />
                  <div className="hero-chip" style={{ bottom: 36, left: 60 }} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
