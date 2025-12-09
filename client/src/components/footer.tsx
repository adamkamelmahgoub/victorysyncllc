import { Link } from 'wouter';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink-900 text-white py-16 border-t border-ink-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/LOGO_VS.png" 
                alt="VictorySync Logo" 
                className="w-8 h-8 rounded-lg bg-white p-1"
              />
              <span className="text-xl font-bold">VictorySync</span>
            </div>
            <p className="text-gray-400 mb-6">
              Professional contact center and AI automation services from Millstone, New Jersey. Helping US businesses reduce costs and improve customer satisfaction.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-white">Services</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/services"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">Inbound Support</span></Link></li>
              <li><Link href="/services"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">Outbound Sales</span></Link></li>
              <li><Link href="/platform"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">AI Automation</span></Link></li>
              <li><Link href="/services"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">Digital Marketing</span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-white">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/about-us"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">About Us</span></Link></li>
              <li><Link href="/careers"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">Careers</span></Link></li>
              <li><Link href="/contact"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">Contact</span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-white">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/help-center"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">Help Center</span></Link></li>
              <li><Link href="/privacy-policy"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">Privacy Policy</span></Link></li>
              <li><Link href="/terms"><span onClick={scrollToTop} className="hover:text-cyan-400 transition-colors cursor-pointer">Terms of Service</span></Link></li>
            </ul>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-32 h-24 bg-gray-600 rounded flex items-center justify-center text-xs text-white text-center">
              <div>
                <div className="font-bold">Close</div>
                <div className="font-bold">Partner</div>
                <div className="text-[10px]">Since 2025</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-ink-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} VictorySync. All rights reserved. | Millstone, New Jersey, USA</p>
        </div>
      </div>
    </footer>
  );
}
