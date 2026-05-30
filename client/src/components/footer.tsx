import { Link } from 'wouter';
import closeBadge from '@assets/Close_PartnerBadge_Since25_1765323409008.png';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink-900 text-white py-16 border-t border-ink-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/LOGO_VS.png"
                alt="VictorySync Logo"
                className="w-8 h-8 rounded-lg bg-white p-1"
              />
              <span className="text-xl font-bold">VictorySync</span>
            </div>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              US-managed contact center and AI automation services. Helping US businesses scale support and sales without hiring in-house.
            </p>
            <p className="text-slate-500 text-xs">
              Millstone, NJ &nbsp;·&nbsp; Cairo, Egypt
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm">Services</h4>
            <ul className="space-y-2.5 text-slate-400 text-sm">
              <li><Link href="/inbound-support"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">Inbound Support</span></Link></li>
              <li><Link href="/appointment-setting"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">Appointment Setting</span></Link></li>
              <li><Link href="/cold-calling"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">Cold Calling</span></Link></li>
              <li><Link href="/ai-automation"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">AI Automation</span></Link></li>
              <li><Link href="/services"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">All Services</span></Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm">Company</h4>
            <ul className="space-y-2.5 text-slate-400 text-sm">
              <li><Link href="/about-us"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">About Us</span></Link></li>
              <li><Link href="/pricing"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">Pricing</span></Link></li>
              <li><Link href="/contact"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">Contact</span></Link></li>
              <li><Link href="/careers"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">Careers</span></Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm">Legal</h4>
            <ul className="space-y-2.5 text-slate-400 text-sm">
              <li><Link href="/privacy-policy"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">Privacy Policy</span></Link></li>
              <li><Link href="/terms"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">Terms of Service</span></Link></li>
              <li>
                <a href="mailto:info@victorysync.com" className="hover:text-cyan-400 transition-colors">
                  info@victorysync.com
                </a>
              </li>
            </ul>
          </div>

          {/* Badge */}
          <div className="flex items-start justify-center md:justify-end">
            <img
              src={closeBadge}
              alt="Close Partner Since 2025"
              className="h-20"
            />
          </div>
        </div>

        <div className="border-t border-ink-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <p>&copy; {currentYear} VictorySync LLC. All rights reserved.</p>
          <p>Millstone, New Jersey, USA &nbsp;·&nbsp; Cairo, Egypt</p>
        </div>
      </div>
    </footer>
  );
}
