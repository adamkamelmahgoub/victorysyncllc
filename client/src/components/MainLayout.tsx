
import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
}

export function MainLayout({ children, className = "", gradient = false }: MainLayoutProps) {
  const baseClasses = "min-h-screen p-6";
  const gradientClasses = gradient 
    ? "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" 
    : "bg-slate-50";

  return (
    <div className={`${baseClasses} ${gradientClasses} ${className}`}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
