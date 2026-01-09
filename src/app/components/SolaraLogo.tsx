import React, { useState } from 'react';

interface SolaraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function SolaraLogo({ className = '', size = 'md', showText = true }: SolaraLogoProps) {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-20',
  };

  const logoWebp = '/images/SOLARA_LOGO.webp';
  const logoJpeg = '/images/Solara-logo.jpeg';

  return (
    <div className={`flex items-center ${showText ? 'gap-3' : 'gap-0'} ${className}`}>
      {/* Logo Image - The logo image already contains the text */}
      <div className={`${sizeClasses[size]} relative flex-shrink-0`}>
        {!imageError ? (
          <picture>
            <source srcSet={logoWebp} type="image/webp" />
            <img
              src={logoJpeg}
              alt="SOLARA Sustainable Energy"
              className="h-full w-auto object-contain"
              onError={() => setImageError(true)}
            />
          </picture>
        ) : (
          // Fallback if images fail to load
          <div className={`${sizeClasses[size]} w-auto flex items-center justify-center bg-slate-50 rounded-lg px-2 border border-slate-200`}>
            <span className="text-[#0F2647] font-bold text-xs">SOLARA</span>
          </div>
        )}
      </div>
    </div>
  );
}

