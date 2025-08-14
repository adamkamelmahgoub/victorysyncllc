
import { NavLink } from "react-router-dom";

const link = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 font-medium transition-colors ${
    isActive ? "text-blue-600 underline" : "text-gray-800 hover:text-blue-600"
  }`;

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-sm">
      <div className="mx-auto max-w-7xl h-16 px-4 flex items-center justify-between">
        <NavLink to="/" className="text-xl font-bold">VictorySync</NavLink>
        <nav className="space-x-2">
          <NavLink to="/pricing" className={link}>Pricing</NavLink>
          <NavLink to="/contact" className={link}>Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}
