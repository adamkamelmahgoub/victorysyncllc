
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { site } from "../content/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const nav = [
    { to: "/", label: "Home", end: true },
    { to: "/solutions", label: "Solutions" },
    { to: "/platform", label: "Platform" },
    { to: "/industries", label: "Industries" },
    { to: "/pricing", label: "Pricing" },
    { to: "/resources", label: "Resources" },
    { to: "/about", label: "About" }
  ];
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    "px-3 py-2 rounded-md transition " +
    (isActive ? "text-primary font-semibold" : "text-slate-700 hover:text-primary");

  return (
    <header className={(scrolled ? "shadow-vs " : "") + "sticky top-0 z-40 bg-white/90 backdrop-blur"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src="/LOGO_VS.png" alt="VictorySync logo" className="h-7 w-auto" />
          <span className="sr-only">{site.brand.name}</span>
        </a>
        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          {nav.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end as boolean} className={linkClass}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <a href="/contact" className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-600 transition">
            Get a Demo
          </a>
        </div>
        <button aria-label="Open Menu" className="md:hidden p-2" onClick={() => setOpen(v => !v)}>
          <span className="block h-0.5 w-6 bg-slate-900 mb-1"></span>
          <span className="block h-0.5 w-6 bg-slate-900 mb-1"></span>
          <span className="block h-0.5 w-6 bg-slate-900"></span>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t">
          <nav className="px-4 py-3 grid gap-1" aria-label="Mobile">
            {nav.map(n => (
              <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)} className={linkClass}>
                {n.label}
              </NavLink>
            ))}
            <a href="/contact" className="mt-2 rounded-lg bg-primary px-4 py-2 text-white text-center">Get a Demo</a>
          </nav>
        </div>
      )}
    </header>
  );
}
