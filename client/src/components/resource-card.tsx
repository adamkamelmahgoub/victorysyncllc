import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { fadeInUp } from './section';

interface ResourceCardProps {
  title: string;
  description: string;
  tag: string;
  href: string;
  image?: string;
}

export function ResourceCard({ title, description, tag, href, image }: ResourceCardProps) {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const CardComponent = prefersReducedMotion ? 'div' : motion.div;
  const cardProps = prefersReducedMotion ? {} : { variants: fadeInUp };

  return (
    <CardComponent
      {...cardProps}
      className="group bg-ink-800/70 border border-ink-700 rounded-xl overflow-hidden hover:-translate-y-0.5 transition-all duration-200"
      data-testid={`resource-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {image && (
        <div className="aspect-video bg-ink-700 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="mb-3">
          <span className="inline-block px-3 py-1 text-xs font-medium text-cyan-400 bg-cyan-400/10 rounded-full">
            {tag}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-400 mb-4 line-clamp-2">
          {description}
        </p>
        
        <Link href={href}>
          <span className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium group/link cursor-pointer">
            Read More
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>
    </CardComponent>
  );
}
