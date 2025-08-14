
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-8 flex items-center justify-between">
        <p className="text-sm">© {new Date().getFullYear()} VictorySync</p>
        <nav className="space-x-3">
          <NavLink to="/privacy-policy" className="hover:underline">Privacy</NavLink>
          <NavLink to="/terms" className="hover:underline">Terms</NavLink>
          <NavLink to="/contact" className="hover:underline">Contact</NavLink>
        </nav>
      </div>
    </footer>
  );
}
