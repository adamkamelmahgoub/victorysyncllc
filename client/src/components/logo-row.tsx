import { motion } from 'framer-motion';

interface LogoRowProps {
  logos: Array<{
    name: string;
    src?: string;
    component?: React.ComponentType<{ className?: string }>;
  }>;
  title?: string;
}

export function LogoRow({ logos, title = "Trusted by leading organizations" }: LogoRowProps) {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <div className="py-12">
      {title && (
        <p className="text-center text-sm font-medium text-gray-400 dark:text-gray-400 mb-8 uppercase tracking-wider">
          {title}
        </p>
      )}
      
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {logos.map((logo, index) => {
          const LogoComponent = prefersReducedMotion ? 'div' : motion.div;
          const logoProps = prefersReducedMotion ? {} : {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { delay: index * 0.1, duration: 0.4 }
          };

          return (
            <LogoComponent
              key={logo.name}
              {...logoProps}
              className="grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-200"
            >
              {logo.component ? (
                <logo.component className="h-8 w-auto" />
              ) : logo.src ? (
                <img src={logo.src} alt={logo.name} className="h-8 w-auto" />
              ) : (
                <span className="text-gray-400 dark:text-gray-400 font-semibold">{logo.name}</span>
              )}
            </LogoComponent>
          );
        })}
      </div>
    </div>
  );
}
