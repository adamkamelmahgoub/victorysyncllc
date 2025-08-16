
import logoVs3d from "@/assets/logo-vs-3d.png";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = "", size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-12 w-auto'
  };

  return (
    <img 
      src={logoVs3d} 
      alt="Victory Sync" 
      className={`${sizeClasses[size]} ${className}`}
    />
  );
}
