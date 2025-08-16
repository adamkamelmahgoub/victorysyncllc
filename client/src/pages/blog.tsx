import SmartLink from '@/components/SmartLink';

export default function Blog() {
  const blogPosts = [
    {
      title: "How to Reduce Customer Service Costs by 60% Without Sacrificing Quality",
      excerpt: "Discover proven strategies that successful businesses use to dramatically cut customer service expenses while improving customer satisfaction scores.",
      author: "Sarah Chen",
      date: "December 15, 2024",
      readTime: "8 min read",
      category: "Cost Optimization",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "The Future of Customer Service: AI Automation vs Human Touch",
      excerpt: "Exploring the perfect balance between artificial intelligence and human empathy in modern customer service operations.",
      author: "Michael Rodriguez",
      date: "December 10, 2024",
      readTime: "6 min read",
      category: "AI Technology",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "5 Signs Your Business Needs Professional Call Center Services",
      excerpt: "Learn to identify the key indicators that suggest it's time to outsource your customer support operations to professionals.",
      author: "Jennifer Walsh",
      date: "December 5, 2024",
      readTime: "5 min read",
      category: "Business Strategy",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
    },
    {
      title: "Building Customer Loyalty Through Exceptional Support Experiences",
      excerpt: "How to turn customer service interactions into relationship-building opportunities that drive long-term business growth.",
      author: "David Park",
      date: "November 28, 2024",
      readTime: "7 min read",
      category: "Customer Experience",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Scaling Your Business with Outsourced Customer Support",
      excerpt: "A comprehensive guide to successfully implementing outsourced support solutions that grow with your business needs.",
      author: "Lisa Thompson",
      date: "November 20, 2024",
      readTime: "9 min read",
      category: "Business Growth",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80"
    },
    {
      title: "The ROI of Professional Customer Service: A Data-Driven Analysis",
      excerpt: "Real numbers and case studies showing the measurable impact of professional customer service on business performance.",
      author: "Robert Kim",
      date: "November 15, 2024",
      readTime: "10 min read",
      category: "Analytics",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  const categories = ["All", "Cost Optimization", "AI Technology", "Business Strategy", "Customer Experience", "Business Growth", "Analytics"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-victory-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">VictorySync Blog</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Insights, strategies, and industry expertise to help you optimize your customer service operations and grow your business.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Categories Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  index === 0
                    ? 'bg-victory-purple text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-victory-purple hover:text-victory-purple'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="h-64 md:h-full w-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center mb-3">
                  <span className="bg-victory-purple/10 text-victory-purple px-3 py-1 rounded-full text-sm font-medium">
                    {blogPosts[0].category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{blogPosts[0].title}</h3>
                <p className="text-gray-600 mb-4">{blogPosts[0].excerpt}</p>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <span>{blogPosts[0].author}</span>
                  <span className="mx-2">•</span>
                  <span>{blogPosts[0].date}</span>
                  <span className="mx-2">•</span>
                  <span>{blogPosts[0].readTime}</span>
                </div>
                <SmartLink href={`/blog/${index}`} className="bg-victory-purple hover:bg-victory-purple/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block">
                  Read Article
                </SmartLink>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Articles */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post, index) => (
              <article key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-victory-purple/10 text-victory-purple px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>{post.author}</span>
                    <span className="mx-2">•</span>
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                    <SmartLink href={`/blog/${index + 1}`} className="text-victory-purple hover:text-victory-purple/80 font-medium transition-colors">
                      Read More →
                    </SmartLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-lg text-gray-600 mb-8">
            Get the latest insights on customer service optimization delivered to your inbox weekly.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-victory-purple focus:border-transparent"
            />
            <SmartLink href="/subscribe" className="bg-victory-purple hover:bg-victory-purple/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block">
              Subscribe
            </SmartLink>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Transform Your Customer Service?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Learn how VictorySync can help you implement the strategies discussed in our blog.
          </p>
          <div className="space-x-4">
            <SmartLink href="/contact" className="bg-victory-purple hover:bg-victory-purple/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block">
              Get Started Today
            </SmartLink>
            <SmartLink href="/pricing" className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors inline-block">
              View Our Services
            </SmartLink>
          </div>
        </div>
      </div>
    </div>
  );
}