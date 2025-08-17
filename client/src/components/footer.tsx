import { Link } from 'wouter';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export default function Footer() {
  return (
    <>
      <div className="bg-vs-cta h-1 w-full" />
      <footer className="bg-victory-dark text-white">
      <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/LOGO_VS.png" 
                alt="VictorySync Logo" 
                className="w-8 h-8 rounded-lg bg-transparent p-1"
              />
              <span className="text-xl brand-font">VictorySync</span>
            </div>
            <p className="text-gray-400 mb-6">
              Professional contact center and AI automation services from Millstone, New Jersey. Helping US businesses reduce costs and improve customer satisfaction.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-victory-purple transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-victory-purple transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-victory-purple transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-6">Services</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/services"><span onClick={scrollToTop} className="hover:text-white transition-colors cursor-pointer">Inbound Support</span></Link></li>
              <li><Link href="/services"><span onClick={scrollToTop} className="hover:text-white transition-colors cursor-pointer">Outbound Sales</span></Link></li>
              <li><Link href="/services"><span onClick={scrollToTop} className="hover:text-white transition-colors cursor-pointer">AI Automation</span></Link></li>
              <li><Link href="/services"><span onClick={scrollToTop} className="hover:text-white transition-colors cursor-pointer">Digital Marketing</span></Link></li>
            </ul>
          </div>

          {/* Company */}
          <div id="about-us">
            <h4 className="font-semibold mb-6">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/about-us"><span onClick={scrollToTop} className="hover:text-white transition-colors cursor-pointer">About Us</span></Link></li>
              <li><Link href="/careers"><span onClick={scrollToTop} className="hover:text-white transition-colors cursor-pointer">Careers</span></Link></li>
              <li><Link href="/contact"><span onClick={scrollToTop} className="hover:text-white transition-colors cursor-pointer">Contact</span></Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-6">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/help-center"><span onClick={scrollToTop} className="hover:text-white transition-colors cursor-pointer">Help Center</span></Link></li>
              <li><Link href="/privacy-policy"><span onClick={scrollToTop} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></Link></li>
              <li><Link href="/terms"><span onClick={scrollToTop} className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>© 2025 VictorySync. All rights reserved.</p>
        </div>
      </div>
      </div>
    </footer>
    </>
  );
}