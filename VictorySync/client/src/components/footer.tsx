import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 py-10 mt-10">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src="/assets/vs-logo-silver.svg" className="h-6" alt="VictorySync" />
          <span className="text-sm text-slate-500">© {new Date().getFullYear()} VictorySync</span>
        </div>
        <nav className="flex gap-5 text-sm">
          <Link to="/products" className="hover:text-slate-900">Products</Link>
          <Link to="/pricing" className="hover:text-slate-900">Pricing</Link>
          <Link to="/blog" className="hover:text-slate-900">Blog</Link>
          <Link to="/company" className="hover:text-slate-900">Company</Link>
        </nav>
      </div>
    </footer>
  )
}