import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { fadeInUp } from './section';

interface MetricTileProps {
  icon?: LucideIcon;
  value: string;
  label: string;
  description?: string;
}

export function MetricTile({ icon: Icon, value, label, description }: MetricTileProps) {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const CardComponent = prefersReducedMotion ? 'div' : motion.div;
  const cardProps = prefersReducedMotion ? {} : { variants: fadeInUp };

  return (
    <CardComponent
      {...cardProps}
      className="group relative bg-slate-900/70 border border-slate-800 rounded-xl p-6 hover:-translate-y-0.5 transition-all duration-200 focus-within:outline focus-within:outline-2 focus-within:outline-emerald-400 focus-within:outline-offset-2"
      data-testid={`metric-tile-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      
      <div className="relative z-10">
        {Icon && (
          <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div className="text-4xl font-bold text-slate-50 mb-2">
          {value}
        </div>
        <div className="text-lg font-medium text-slate-300 mb-1">
          {label}
        </div>
        {description && (
          <p className="text-sm text-slate-400">
            {description}
          </p>
        )}
      </div>
    </CardComponent>
  );
}
