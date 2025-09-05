
import { Link } from "react-router-dom";

export default function FooterPro(){
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <img src="/LOGO_VS.png" alt="VictorySync" className="h-6 w-auto" />
            <p className="mt-3 text-sm text-slate-600">AI-powered CX, Cairo operations, US clients. 24/7 coverage with measurable ROI.</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-900">Company</p>
            <nav className="grid gap-2 text-sm text-slate-600">
              <Link to="/about" className="hover:text-slate-900">About</Link>
              <Link to="/resources" className="hover:text-slate-900">Resources</Link>
              <Link to="/contact" className="hover:text-slate-900">Contact</Link>
            </nav>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-900">Solutions</p>
            <nav className="grid gap-2 text-sm text-slate-600">
              <Link to="/solutions" className="hover:text-slate-900">Inbound Support</Link>
              <Link to="/solutions" className="hover:text-slate-900">Outbound Growth</Link>
              <Link to="/solutions" className="hover:text-slate-900">Helpdesk & Live Chat</Link>
              <Link to="/solutions" className="hover:text-slate-900">QA & Analytics</Link>
            </nav>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-900">Get in touch</p>
            <p className="text-sm text-slate-600">Call: +1 (718) 813-2106<br/>Email: victorysynccx@gmail.com</p>
            <Link to="/contact" className="mt-3 inline-block rounded-md border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Get a Demo</Link>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">© {new Date().getFullYear()} VictorySync LLC. All rights reserved.</p>
      </div>
    </footer>
  );
}
