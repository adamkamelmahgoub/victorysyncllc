import { Link } from "wouter";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-victory-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About VictorySync
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transforming customer service operations with professional call
              center solutions and AI automation from Millstone, New Jersey.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              At VictorySync, we believe every business deserves world-class
              customer service without the enterprise price tag. We help US
              businesses reduce customer service costs by up to 60% while
              maintaining exceptional quality and satisfaction.
            </p>
            <p className="text-lg text-gray-600">
              Based in Millstone, New Jersey, our team combines local expertise
              with cutting-edge technology to deliver scalable solutions that
              grow with your business.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Why Choose VictorySync?
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-victory-purple font-bold mr-3">✓</span>
                <span>60% cost reduction on customer service operations</span>
              </li>
              <li className="flex items-start">
                <span className="text-victory-purple font-bold mr-3">✓</span>
                <span>24/7 professional support coverage</span>
              </li>
              <li className="flex items-start">
                <span className="text-victory-purple font-bold mr-3">✓</span>
                <span>Advanced AI automation and workflow optimization</span>
              </li>
              <li className="flex items-start">
                <span className="text-victory-purple font-bold mr-3">✓</span>
                <span>Scalable solutions for businesses of all sizes</span>
              </li>
              <li className="flex items-start">
                <span className="text-victory-purple font-bold mr-3">✓</span>
                <span>US-based management with global expertise</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Services Overview */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-victory-purple/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-victory-purple"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Inbound Support
              </h3>
              <p className="text-gray-600 text-sm">
                24/7 customer service and technical support
              </p>
            </div>
            <div className="text-center">
              <div className="bg-victory-purple/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-victory-purple"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Outbound Sales
              </h3>
              <p className="text-gray-600 text-sm">
                Lead generation and appointment setting
              </p>
            </div>
            <div className="text-center">
              <div className="bg-victory-purple/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-victory-purple"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                AI Automation
              </h3>
              <p className="text-gray-600 text-sm">
                Intelligent chatbots and workflow automation
              </p>
            </div>
            <div className="text-center">
              <div className="bg-victory-purple/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-victory-purple"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4L5.5 6M17 4l1.5 2M12 12v4M8 16h8"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Digital Marketing
              </h3>
              <p className="text-gray-600 text-sm">
                Social media and content management
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Customer Service?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join hundreds of businesses that have reduced costs and improved
            satisfaction with VictorySync.
          </p>
          <div className="space-x-4">
            <Link href="/contact">
              <button className="bg-victory-purple hover:bg-victory-purple/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Get Started Today
              </button>
            </Link>
            <Link href="/pricing">
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors">
                View Pricing
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
