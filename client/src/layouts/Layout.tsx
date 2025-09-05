
import { Outlet, Link, NavLink, useLocation } from "react-router-dom";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

const nav = [
  { to: "/solutions", label: "Solutions" },
  { to: "/platform", label: "Platform" },
  { to: "/industries", label: "Industries" },
  { to: "/pricing", label: "Pricing" },
  { to: "/resources", label: "Resources" },
  { to: "/about", label: "About" },
];

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <>
      <header className="vs-header">
        <div className="container flex between center">
          <Link to="/" className="flex center gap-8">
            <Logo />
            <span className="brand">VictorySync</span>
          </Link>
          <nav className="nav">
            {nav.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex gap-8">
            <Link className="btn ghost" to="/signin">Sign in</Link>
            <Link className="btn primary" to="/demo">Get a Demo</Link>
          </div>
        </div>
        <div className={`header-glow glow-${pathname === "/" ? "home" : "page"}`} />
      </header>

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
