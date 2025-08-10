
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'white';
}

const Logo: React.FC<LogoProps> = ({ className = '', variant = 'default' }) => {
  const textColor = variant === 'white' ? 'text-white' : 'text-victory-black';
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center justify-center w-8 h-8 bg-victory-gradient rounded-lg">
        <span className="text-white font-bold text-xl">V</span>
      </div>
      <span className={`font-bold text-xl ${textColor}`}>
        VictorySync
      </span>
    </div>
  );
};

export default Logo;
