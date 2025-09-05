
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold">
            <img src="/vs_favicon_32.png" className="h-6 w-6" alt="" />
            VictorySync
          </div>
          <p className="text-sm text-slate-600">AI-powered CX. Cairo operations, U.S. clients. 24/7 inbound & outbound with measurable ROI.</p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="text-sm grid gap-2">
            <li><Link to="/about" className="hover:text-indigo-600">About</Link></li>
            <li><Link to="/resources" className="hover:text-indigo-600">Resources</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-600">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Solutions</h4>
          <ul className="text-sm grid gap-2">
            <li><Link to="/solutions" className="hover:text-indigo-600">Inbound Support</Link></li>
            <li><Link to="/solutions" className="hover:text-indigo-600">Outbound Growth</Link></li>
            <li><Link to="/solutions" className="hover:text-indigo-600">Helpdesk & Live Chat</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Get in touch</h4>
          <ul className="text-sm grid gap-2">
            <li>Call: +1 (718) 813-2106</li>
            <li>Email: victorysynccx@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">© {new Date().getFullYear()} VictorySync LLC. All rights reserved.</div>
    </footer>
  );
}
