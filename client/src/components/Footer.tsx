
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="vs-footer">
      <div className="container grid cols-4 gap-24">
        <div>
          <div className="brand-row">
            <div className="logo-sm">V</div>
            <strong>VictorySync</strong>
          </div>
          <p className="muted">AI-powered CX. Cairo operations, U.S. clients.</p>
          <p className="muted">24/7 inbound & outbound with measurable ROI.</p>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/resources">Resources</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4>Solutions</h4>
          <ul>
            <li><Link to="/solutions#inbound">Inbound Support</Link></li>
            <li><Link to="/solutions#outbound">Outbound Growth</Link></li>
            <li><Link to="/solutions#helpdesk">Helpdesk & Live Chat</Link></li>
            <li><Link to="/solutions#qa">QA & Analytics</Link></li>
          </ul>
        </div>
        <div>
          <h4>Get in touch</h4>
          <ul>
            <li>+1 (718) 813-2106</li>
            <li><a href="mailto:victorysynccx@gmail.com">victorysynccx@gmail.com</a></li>
            <li><Link to="/demo">Request a demo →</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bar">© {new Date().getFullYear()} VictorySync LLC. All rights reserved.</div>
    </footer>
  );
}
