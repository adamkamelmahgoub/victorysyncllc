import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <img src="/LOGO_VS.png" alt="VictorySync" className="h-8 w-auto mb-3" />
          <p className="text-sm text-slate-600">
            AI-powered CX, Cairo operations, U.S. clients. 24/7 inbound & outbound with measurable ROI.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Company</h3>
          <ul className="space-y-1 text-sm">
            <li><a className="hover:text-primary" href="/about">About</a></li>
            <li><a className="hover:text-primary" href="/resources">Resources</a></li>
            <li><a className="hover:text-primary" href="/contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Solutions</h3>
          <ul className="space-y-1 text-sm">
            <li>Inbound Support</li>
            <li>Outbound Growth</li>
            <li>Helpdesk & Live Chat</li>
            <li>QA & Analytics</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Get in touch</h3>
          <p className="text-sm">Call: <a className="hover:text-primary" href="tel:+17188132106">+1 (718) 813-2106</a></p>
          <p className="text-sm">Email: <a className="hover:text-primary" href="mailto:victorysynccx@gmail.com">victorysynccx@gmail.com</a></p>
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 py-6 border-t">
        © {new Date().getFullYear()} VictorySync LLC. All rights reserved.
      </div>
    </footer>
  );
}