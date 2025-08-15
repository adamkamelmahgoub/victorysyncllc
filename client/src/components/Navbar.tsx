
import { NavLink } from "react-router-dom";
export default function Navbar() {
  const link = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 ${isActive ? "underline" : "hover:underline"}`;
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto h-14 px-4 flex items-center justify-between">
        <NavLink to="/" className="font-bold">VictorySync</NavLink>
        <nav className="space-x-2">
          <NavLink to="/pricing" className={link}>Pricing</NavLink>
          <NavLink to="/contact" className={link}>Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}
