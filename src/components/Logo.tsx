import React from 'react';
import { GraduationCap } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ className = "", size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: 'text-lg' },
    md: { icon: 48, text: 'text-2xl' },
    lg: { icon: 64, text: 'text-4xl' }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center text-indigo-600" style={{ width: sizes[size].icon, height: sizes[size].icon }}>
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
          {/* Graduation Cap */}
          <path d="M50 15L15 35L50 55L85 35L50 15Z" />
          <path d="M25 40V55C25 55 35 65 50 65C65 65 75 55 75 55V40" stroke="currentColor" strokeWidth="4" fill="none" />
          
          {/* Person / V-shape */}
          <circle cx="50" cy="52" r="10" />
          <path d="M20 65L50 85L80 65L50 72L20 65Z" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${sizes[size].text} font-bold tracking-tight text-slate-900`}>
            LGS <span className="text-indigo-600">Koçum</span>
          </span>
          <span className="text-base font-thin text-slate-500 tracking-wide">Başarıya giden yol.</span>
        </div>
      )}
    </div>
  );
}
