import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'header' | 'masthead' | 'footer' | 'emblem-only' | 'digest';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'header',
  showTagline = false,
}) => {
  // Bespoke Heraldic Newspaper Insignia / Seal
  const Emblem = ({ size = 36, isDark = false }: { size?: number; isDark?: boolean }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform group-hover:scale-105 duration-200"
      aria-hidden="true"
    >
      {/* Outer double border */}
      <circle
        cx="50"
        cy="50"
        r="47"
        stroke={isDark ? '#FAF8F5' : '#1C1917'}
        strokeWidth="1.75"
        className="opacity-90"
      />
      <circle
        cx="50"
        cy="50"
        r="43.5"
        stroke={isDark ? '#FAF8F5' : '#1C1917'}
        strokeWidth="0.75"
        strokeDasharray="1.5 1.5"
        className="opacity-70"
      />

      {/* Terracotta Inner Glow Accent */}
      <circle cx="50" cy="50" r="39" stroke="#9A3412" strokeWidth="1.25" opacity="0.85" />

      {/* Globe Meridian and Parallel Arcs */}
      <ellipse
        cx="50"
        cy="50"
        rx="28"
        ry="28"
        stroke={isDark ? '#FAF8F5' : '#1C1917'}
        strokeWidth="1"
        opacity="0.8"
      />
      {/* Equator & Parallels */}
      <line
        x1="22"
        y1="50"
        x2="78"
        y2="50"
        stroke="#9A3412"
        strokeWidth="1.2"
        strokeDasharray="2 1"
      />
      <path
        d="M26 38 C34 43, 66 43, 74 38"
        stroke={isDark ? '#FAF8F5' : '#1C1917'}
        strokeWidth="0.8"
        opacity="0.6"
      />
      <path
        d="M26 62 C34 57, 66 57, 74 62"
        stroke={isDark ? '#FAF8F5' : '#1C1917'}
        strokeWidth="0.8"
        opacity="0.6"
      />

      {/* Meridians */}
      <ellipse
        cx="50"
        cy="50"
        rx="14"
        ry="28"
        stroke={isDark ? '#FAF8F5' : '#1C1917'}
        strokeWidth="0.85"
        opacity="0.65"
      />
      <line
        x1="50"
        y1="22"
        x2="50"
        y2="78"
        stroke={isDark ? '#FAF8F5' : '#1C1917'}
        strokeWidth="1"
        opacity="0.75"
      />

      {/* Editorial Laurel Wreath Leaves (Left) */}
      <path
        d="M24 64 C20 54, 21 42, 27 34"
        stroke="#9A3412"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M21 54 C17 52, 17 48, 22 50" fill="#9A3412" opacity="0.85" />
      <path d="M23 44 C19 41, 20 37, 25 41" fill="#9A3412" opacity="0.85" />
      <path d="M27 35 C24 31, 27 28, 30 32" fill="#9A3412" opacity="0.85" />

      {/* Editorial Laurel Wreath Leaves (Right) */}
      <path
        d="M76 64 C80 54, 79 42, 73 34"
        stroke="#9A3412"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M79 54 C83 52, 83 48, 78 50" fill="#9A3412" opacity="0.85" />
      <path d="M77 44 C81 41, 80 37, 75 41" fill="#9A3412" opacity="0.85" />
      <path d="M73 35 C76 31, 73 28, 70 32" fill="#9A3412" opacity="0.85" />

      {/* Crossed Antique Quill Pen & Stylus in Center */}
      <g transform="rotate(-30 50 50)">
        {/* Quill Spine */}
        <path
          d="M50 18 L50 82"
          stroke={isDark ? '#FFFFFF' : '#111827'}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {/* Quill Feather Plume */}
        <path
          d="M50 20 C58 24, 60 38, 50 48 C40 38, 42 24, 50 20 Z"
          fill={isDark ? '#FAF8F5' : '#1C1917'}
          opacity="0.9"
        />
        {/* Feather vane cuts */}
        <line x1="50" y1="28" x2="56" y2="25" stroke="#9A3412" strokeWidth="0.8" />
        <line x1="50" y1="34" x2="57" y2="31" stroke="#9A3412" strokeWidth="0.8" />
        <line x1="50" y1="40" x2="55" y2="38" stroke="#9A3412" strokeWidth="0.8" />
        {/* Nib */}
        <polygon points="48,76 52,76 50,82" fill="#9A3412" />
      </g>

      {/* North & South Cardinal Compass Stars */}
      <polygon points="50,6 52,12 50,11 48,12" fill="#9A3412" />
      <polygon points="50,94 52,88 50,89 48,88" fill="#9A3412" />
      <polygon points="6,50 12,48 11,50 12,52" fill="#9A3412" />
      <polygon points="94,50 88,48 89,50 88,52" fill="#9A3412" />

      {/* Micro Latin Inscription dots */}
      <circle cx="34" cy="18" r="1" fill={isDark ? '#FAF8F5' : '#1C1917'} opacity="0.5" />
      <circle cx="66" cy="18" r="1" fill={isDark ? '#FAF8F5' : '#1C1917'} opacity="0.5" />
      <circle cx="34" cy="82" r="1" fill={isDark ? '#FAF8F5' : '#1C1917'} opacity="0.5" />
      <circle cx="66" cy="82" r="1" fill={isDark ? '#FAF8F5' : '#1C1917'} opacity="0.5" />
    </svg>
  );

  if (variant === 'emblem-only') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <Emblem size={38} />
      </div>
    );
  }

  if (variant === 'masthead') {
    return (
      <div className={`flex flex-col items-center text-center py-4 ${className}`}>
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="hidden sm:block h-[1px] w-16 md:w-24 bg-stone-300 dark:bg-stone-700" />
          <Emblem size={52} />
          <div className="hidden sm:block h-[1px] w-16 md:w-24 bg-stone-300 dark:bg-stone-700" />
        </div>
        <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-stone-950 dark:text-stone-50 uppercase leading-none">
          THE GLOBAL CHRONICLES
        </h1>
        <div className="flex items-center justify-center gap-3 mt-2 text-[11px] font-mono tracking-widest uppercase text-stone-600 dark:text-stone-400">
          <span>Veritas</span>
          <span className="text-[#9A3412]">·</span>
          <span>International Dispatches</span>
          <span className="text-[#9A3412]">·</span>
          <span>Est. 2026</span>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-3.5 ${className}`}>
        <Emblem size={44} isDark={true} />
        <div className="flex flex-col">
          <span className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-white uppercase leading-tight">
            THE GLOBAL CHRONICLES
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A3412]">
            Independent International Journalism · Worldwide Wire
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'digest') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Emblem size={38} />
        <div className="flex flex-col text-left">
          <span className="font-editorial text-lg sm:text-xl font-bold tracking-tight text-stone-950 dark:text-stone-50 uppercase leading-tight">
            THE GLOBAL CHRONICLES
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A3412]">
            Global Daily Digest · Morning & Evening Edition
          </span>
        </div>
      </div>
    );
  }

  // Default: Header variant
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Emblem size={36} />
      <div className="flex flex-col text-left">
        <span className="font-editorial text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-stone-950 dark:text-stone-50 whitespace-nowrap leading-none group-hover:text-[#9A3412] transition-colors">
          THE GLOBAL CHRONICLES
        </span>
        {showTagline && (
          <span className="hidden sm:block text-[9px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 mt-0.5">
            Independent World Wire
          </span>
        )}
      </div>
    </div>
  );
};
