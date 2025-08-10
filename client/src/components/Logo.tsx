import logoImage from '../assets/logo-vs-3d.png';

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export function Logo({ size = 32, showText = true }: LogoProps) {
  return (
    <div className="flex items-center space-x-2">
      <img 
        src={logoImage} 
        alt="VictorySync" 
        className={`h-${Math.floor(size/4)} w-auto`}
        style={{ height: `${size}px` }}
      />
      {showText && (
        <span className="text-xl font-bold brand-font">
          <span className="victory-purple">Victory</span>
          <span className="victory-blue">Sync</span>
        </span>
      )}
    </div>
  );
}