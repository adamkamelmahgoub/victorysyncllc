
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">VictorySync</h3>
            <p className="text-gray-600 text-sm">
              Professional customer service solutions that save you 60% while improving quality.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><NavLink to="/services" className="text-gray-600 hover:text-blue-600">Customer Support</NavLink></li>
              <li><NavLink to="/services" className="text-gray-600 hover:text-blue-600">Lead Generation</NavLink></li>
              <li><NavLink to="/services" className="text-gray-600 hover:text-blue-600">Technical Support</NavLink></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><NavLink to="/about" className="text-gray-600 hover:text-blue-600">About Us</NavLink></li>
              <li><NavLink to="/contact" className="text-gray-600 hover:text-blue-600">Contact</NavLink></li>
              <li><NavLink to="/pricing" className="text-gray-600 hover:text-blue-600">Pricing</NavLink></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><NavLink to="/privacy-policy" className="text-gray-600 hover:text-blue-600">Privacy Policy</NavLink></li>
              <li><NavLink to="/terms" className="text-gray-600 hover:text-blue-600">Terms of Service</NavLink></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} VictorySync. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <NavLink to="/contact" className="text-gray-600 hover:text-blue-600 text-sm">Contact Us</NavLink>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600 text-sm">+1 (718) 813-2106</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
