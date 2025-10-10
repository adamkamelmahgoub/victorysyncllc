
import { NavLink, Link } from 'react-router-dom'

const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 text-sm font-medium ${isActive ? 'text-brand-purple' : 'text-slate-700 hover:text-slate-900'}`
    }
  >
    {children}
  </NavLink>
)

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/vs-logo-silver.svg" alt="VictorySync" className="h-7 w-auto" />
          <span className="sr-only">VictorySync</span>
        </Link>
        <nav className="hidden md:flex items-center">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/products">Products</NavItem>
          <NavItem to="/pricing">Pricing</NavItem>
          <NavItem to="/blog">Blog</NavItem>
          <NavItem to="/company">Company</NavItem>
        </nav>
        <Link to="/book" className="btn btn-primary">Get started</Link>
      </div>
    </header>
  )
}
