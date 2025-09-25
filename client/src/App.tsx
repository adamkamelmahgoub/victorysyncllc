
import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-white">
          <div className="mb-8">
            <img 
              src="/LOGO_VS.png" 
              alt="VictorySync Logo" 
              className="mx-auto h-24 w-auto mb-6"
            />
          </div>
          
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            VictorySync
          </h1>
          
          <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-300">
            Professional Customer Service Platform
          </p>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold mb-6">Transform Your Customer Experience</h2>
            <p className="text-lg mb-6">
              Reduce customer service costs by up to 60% with our professional call center services, 
              AI automation, and comprehensive business solutions from Millstone, New Jersey.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
                <p className="text-gray-300">Professional agents available around the clock</p>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">AI Automation</h3>
                <p className="text-gray-300">Intelligent systems to streamline operations</p>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Cost Savings</h3>
                <p className="text-gray-300">Reduce expenses while improving quality</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-gray-400">
              Contact us to learn more about our professional services
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
