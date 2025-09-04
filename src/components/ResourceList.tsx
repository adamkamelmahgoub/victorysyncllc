
import { Link } from 'react-router-dom';
import { Download, Clock, ArrowRight } from 'lucide-react';

const resources = [
  {
    id: 'roi-calculator',
    title: 'ROI Calculator',
    description: 'Calculate your potential savings with our call center services',
    type: 'Tool',
    readTime: '5 min',
    slug: 'roi-calculator'
  },
  {
    id: 'best-practices',
    title: 'Call Center Best Practices',
    description: 'Essential strategies for optimizing performance and satisfaction',
    type: 'Guide',
    readTime: '8 min',
    slug: 'best-practices'
  },
  {
    id: 'ai-automation',
    title: 'AI Automation in Customer Service',
    description: 'How artificial intelligence is transforming call centers',
    type: 'Whitepaper',
    readTime: '10 min',
    slug: 'ai-automation'
  }
];

export default function ResourceList() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource) => (
        <div key={resource.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {resource.type}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {resource.readTime}
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {resource.title}
          </h3>
          
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            {resource.description}
          </p>
          
          <div className="flex items-center justify-between">
            <Link 
              to={`/resources/${resource.slug}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Read More
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            
            <button 
              onClick={() => console.log(`Download ${resource.title}`)}
              className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
