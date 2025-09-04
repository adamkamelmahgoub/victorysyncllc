import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const nav = useNavigate();

  const items = [
    { to: "/", label: "Home", end: true },
    { to: "/solutions", label: "Solutions" },
    { to: "/platform", label: "Platform" },
    { to: "/industries", label: "Industries" },
    { to: "/pricing", label: "Pricing" },
    { to: "/resources", label: "Resources" },
    { to: "/about", label: "About" }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl h-16 px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/LOGO_VS.png" alt="VictorySync" className="h-7 w-auto" />
        </Link>
        <nav className="hidden md:flex gap-2" aria-label="Main">
          {items.map(i => (
            <NavLink key={i.to} to={i.to} end={i.end as boolean}
              className={({isActive}) => "px-3 py-2 rounded-md transition " + (isActive ? "text-primary font-semibold" : "text-slate-700 hover:text-primary")}>
              {i.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="rounded-lg border px-4 py-2 hover:bg-slate-50 transition">Sign in</Link>
              <Link to="/contact" className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-600 transition">Get a Demo</Link>
            </>
          ) : (
            <>
              <Link to="/customer-dashboard" className="rounded-lg border px-4 py-2 hover:bg-slate-50 transition">Dashboard</Link>
              <button onClick={() => { logout(); nav("/"); }} className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-600 transition">Sign out</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}