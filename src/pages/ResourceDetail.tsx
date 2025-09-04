
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Clock, User } from 'lucide-react';

const resourceData: Record<string, {
  title: string;
  description: string;
  content: string;
  author: string;
  readTime: string;
  downloadUrl?: string;
}> = {
  'roi-calculator': {
    title: 'ROI Calculator for Call Center Operations',
    description: 'Calculate your potential savings with VictorySync\'s call center services',
    content: `Our comprehensive ROI calculator helps you understand the financial impact of outsourcing your call center operations to VictorySync. With our Cairo-based team and AI-powered automation, most clients see cost reductions of 40-60% while improving service quality.

Key factors in calculating your ROI:
• Current staffing costs (salary, benefits, overhead)
• Technology and infrastructure expenses
• Training and management costs
• Efficiency gains through our proven processes
• Quality improvements and customer satisfaction metrics

The calculator takes into account your current volume, average handle time, and service level requirements to provide a customized projection of your potential savings.`,
    author: 'VictorySync Analysis Team',
    readTime: '5 min read',
    downloadUrl: '/resources/roi-calculator.pdf'
  },
  'best-practices': {
    title: 'Call Center Best Practices Guide',
    description: 'Essential strategies for optimizing call center performance and customer satisfaction',
    content: `This comprehensive guide covers the essential best practices that top-performing call centers use to deliver exceptional customer service while maintaining operational efficiency.

Topics covered include:
• Agent training and development programs
• Quality assurance frameworks
• Performance metrics and KPIs
• Technology stack optimization
• Customer journey mapping
• Multichannel support strategies
• Escalation procedures
• Knowledge management systems

Learn how VictorySync implements these practices with our Cairo-based team to deliver superior results for our U.S. clients.`,
    author: 'Operations Excellence Team',
    readTime: '8 min read',
    downloadUrl: '/resources/best-practices.pdf'
  },
  'ai-automation': {
    title: 'AI Automation in Customer Service',
    description: 'How artificial intelligence is transforming call center operations',
    content: `Artificial intelligence is revolutionizing customer service operations, enabling call centers to handle more inquiries with greater efficiency and accuracy. This guide explores practical AI applications currently being implemented across the industry.

Key AI applications covered:
• Intelligent call routing and prioritization
• Real-time agent assistance and coaching
• Automated quality assurance and scoring
• Predictive analytics for workforce management
• Natural language processing for customer insights
• Chatbot integration and handoff optimization
• Sentiment analysis and emotion detection
• Automated reporting and performance analytics

Discover how VictorySync leverages these technologies to provide 24/7 support with consistent quality and reduced costs.`,
    author: 'AI Innovation Team',
    readTime: '10 min read',
    downloadUrl: '/resources/ai-automation.pdf'
  }
};

export default function ResourceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const resource = slug ? resourceData[slug] : null;

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Resource Not Found</h1>
          <p className="text-gray-600 mb-6">The requested resource could not be found.</p>
          <Link 
            to="/resources" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link 
          to="/resources" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Resources
        </Link>

        <article className="bg-white rounded-lg shadow-sm p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {resource.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {resource.description}
            </p>
            <div className="flex items-center text-sm text-gray-500 space-x-6">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {resource.author}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {resource.readTime}
              </div>
            </div>
          </header>

          <div className="prose prose-lg max-w-none mb-8">
            {resource.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {resource.downloadUrl && (
            <div className="border-t pt-6">
              <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
              <p className="text-sm text-gray-500 mt-2">
                PDF version available for offline reading
              </p>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
