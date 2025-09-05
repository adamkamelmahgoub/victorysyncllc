
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "./ui/Button";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <img src="/vs_favicon_32.png" alt="" className="h-6 w-6" />
          VictorySync
        </Link>

        <button className="lg:hidden rounded-md p-2 hover:bg-slate-100" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>

        <ul className="hidden lg:flex items-center gap-6 text-sm">
          {["Home","Solutions","Platform","Industries","Pricing","Resources","About"].map((item) => {
            const to = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            return (
              <li key={item}>
                <NavLink to={to} className={({isActive}) => `hover:text-indigo-600 ${isActive ? "text-indigo-600" : "text-slate-700"}`}>
                  {item}
                </NavLink>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-700">Hi, {user?.email}</span>
              <Button variant="secondary" onClick={() => navigate("/customer-dashboard")}>Dashboard</Button>
              <Button variant="ghost" onClick={() => logout()}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>Sign in</Button>
              <Button onClick={() => navigate("/contact")}>Get a Demo</Button>
            </>
          )}
        </div>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-slate-200">
          <ul className="px-4 py-3 grid gap-2">
            {["Home","Solutions","Platform","Industries","Pricing","Resources","About","Contact"].map((item) => {
              const to = item === "Home" ? "/" : `/${item.toLowerCase()}`;
              return (
                <li key={item} onClick={() => setOpen(false)}>
                  <NavLink to={to} className="block rounded-md px-3 py-2 hover:bg-slate-100">{item}</NavLink>
                </li>
              );
            })}
            {!isAuthenticated ? (
              <li onClick={() => setOpen(false)}><NavLink to="/login" className="block rounded-md px-3 py-2 hover:bg-slate-100">Sign in</NavLink></li>
            ) : (
              <>
                <li><NavLink to="/customer-dashboard" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 hover:bg-slate-100">Dashboard</NavLink></li>
                <li><button className="w-full text-left rounded-md px-3 py-2 hover:bg-slate-100" onClick={() => { setOpen(false); logout(); }}>Logout</button></li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
