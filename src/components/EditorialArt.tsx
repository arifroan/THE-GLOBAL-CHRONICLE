import React from 'react';

interface EditorialArtProps {
  category: string;
  className?: string;
  headline?: string;
  aspect?: '16:9' | '4:3' | '3:2' | 'square';
}

export const EditorialArt: React.FC<EditorialArtProps> = ({
  category,
  className = '',
  headline = '',
  aspect = '16:9',
}) => {
  const aspectClass =
    aspect === '16:9'
      ? 'aspect-[16/9]'
      : aspect === '4:3'
      ? 'aspect-[4/3]'
      : aspect === 'square'
      ? 'aspect-square'
      : 'aspect-[3/2]';

  switch (category) {
    case 'diplomacy':
      return (
        <div
          className={`relative w-full overflow-hidden bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#1E293B] text-white flex items-center justify-center p-6 ${aspectClass} ${className}`}
        >
          {/* Architectural / assembly hall aesthetic */}
          <svg
            className="absolute inset-0 w-full h-full opacity-35"
            viewBox="0 0 800 450"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Assembly Hall arcs */}
            <circle cx="400" cy="420" r="120" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="400" cy="420" r="200" stroke="white" strokeWidth="1" />
            <circle cx="400" cy="420" r="280" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="400" cy="420" r="360" stroke="white" strokeWidth="1" />
            {/* Diplomatic rays */}
            <line x1="400" y1="420" x2="160" y2="100" stroke="white" strokeWidth="0.8" opacity="0.6" />
            <line x1="400" y1="420" x2="280" y2="60" stroke="white" strokeWidth="0.8" opacity="0.6" />
            <line x1="400" y1="420" x2="400" y2="40" stroke="white" strokeWidth="1" opacity="0.9" />
            <line x1="400" y1="420" x2="520" y2="60" stroke="white" strokeWidth="0.8" opacity="0.6" />
            <line x1="400" y1="420" x2="640" y2="100" stroke="white" strokeWidth="0.8" opacity="0.6" />
            {/* Stylized podium and seal */}
            <rect x="360" y="380" width="80" height="30" rx="2" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1" />
            {/* Latitude longitude grids */}
            <path d="M 0 225 Q 400 150 800 225" stroke="#9A3412" strokeWidth="1.5" strokeOpacity="0.8" />
          </svg>
          <div className="relative z-10 flex flex-col justify-end w-full h-full text-left pointer-events-none">
            <span className="text-[11px] tracking-widest uppercase font-mono text-stone-400">
              International Diplomatic Dispatch · Geneva Plenary
            </span>
            {headline && (
              <span className="text-xs font-serif italic text-stone-200 mt-1 line-clamp-1 opacity-80">
                {headline}
              </span>
            )}
          </div>
        </div>
      );

    case 'tech':
      return (
        <div
          className={`relative w-full overflow-hidden bg-gradient-to-br from-[#0A0F1D] via-[#0F172A] to-[#1E1B4B] text-white flex items-center justify-center p-6 ${aspectClass} ${className}`}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-40"
            viewBox="0 0 800 450"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Quantum wave & photon paths */}
            <defs>
              <linearGradient id="quantumGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#818CF8" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path
              d="M 50 225 C 200 80, 250 370, 400 225 C 550 80, 600 370, 750 225"
              stroke="url(#quantumGlow)"
              strokeWidth="2.5"
            />
            <path
              d="M 50 225 C 200 370, 250 80, 400 225 C 550 370, 600 80, 750 225"
              stroke="#38BDF8"
              strokeWidth="1"
              strokeDasharray="4 6"
              opacity="0.6"
            />
            {/* Optical lattice points */}
            {[100, 200, 300, 400, 500, 600, 700].map((x, i) => (
              <g key={i}>
                <circle cx={x} cy="225" r="4" fill="#38BDF8" />
                <circle cx={x} cy="225" r="10" stroke="#38BDF8" strokeWidth="0.8" strokeOpacity="0.4" />
                <line x1={x} y1="120" x2={x} y2="330" stroke="white" strokeWidth="0.5" strokeOpacity="0.15" />
              </g>
            ))}
          </svg>
          <div className="relative z-10 flex flex-col justify-end w-full h-full text-left pointer-events-none">
            <span className="text-[11px] tracking-widest uppercase font-mono text-sky-400">
              Photonic Quantum Infrastructure · Tsukuba Lab
            </span>
          </div>
        </div>
      );

    case 'climate':
      return (
        <div
          className={`relative w-full overflow-hidden bg-gradient-to-br from-[#064E3B] via-[#042F2E] to-[#0F172A] text-white flex items-center justify-center p-6 ${aspectClass} ${className}`}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-40"
            viewBox="0 0 800 450"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Wind turbine towers & sun vector */}
            <circle cx="680" cy="90" r="45" stroke="#FDE047" strokeWidth="1.5" strokeOpacity="0.7" fill="#FDE047" fillOpacity="0.1" />
            {/* Ocean horizon */}
            <line x1="0" y1="280" x2="800" y2="280" stroke="#34D399" strokeWidth="1.2" strokeOpacity="0.5" />
            <path d="M 0 310 Q 200 295 400 310 T 800 310" stroke="#34D399" strokeWidth="1" strokeOpacity="0.3" />
            {/* Turbines */}
            {[200, 380, 560].map((tx, idx) => (
              <g key={idx} transform={`translate(${tx}, ${150 + idx * 15})`}>
                <line x1="0" y1="0" x2="0" y2="130" stroke="white" strokeWidth="2" strokeOpacity="0.8" />
                {/* Rotor center */}
                <circle cx="0" cy="0" r="3" fill="white" />
                {/* 3 blades */}
                <line x1="0" y1="0" x2="0" y2="-45" stroke="white" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="38" y2="22" stroke="white" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="-38" y2="22" stroke="white" strokeWidth="1.5" />
              </g>
            ))}
          </svg>
          <div className="relative z-10 flex flex-col justify-end w-full h-full text-left pointer-events-none">
            <span className="text-[11px] tracking-widest uppercase font-mono text-emerald-400">
              Clean Energy Supergrid · North Sea Corridor
            </span>
          </div>
        </div>
      );

    case 'finance':
      return (
        <div
          className={`relative w-full overflow-hidden bg-gradient-to-br from-[#1E1B4B] via-[#111827] to-[#1F2937] text-white flex items-center justify-center p-6 ${aspectClass} ${className}`}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-35"
            viewBox="0 0 800 450"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Currency chart grid and candlestick lines */}
            <path d="M 50 50 L 50 400 L 750 400" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
            {/* Market trend curve */}
            <path
              d="M 50 320 C 180 340, 280 210, 420 230 C 540 250, 620 120, 750 100"
              stroke="#E0E7FF"
              strokeWidth="2.5"
            />
            {/* Horizontal price guide levels */}
            {[100, 180, 260, 340].map((y, i) => (
              <line key={i} x1="50" y1={y} x2="750" y2={y} stroke="white" strokeWidth="0.5" strokeDasharray="4 6" strokeOpacity="0.2" />
            ))}
            {/* Vertical date ticks */}
            {[150, 280, 420, 560, 680].map((x, i) => (
              <line key={i} x1={x} y1="395" x2={x} y2="405" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
            ))}
          </svg>
          <div className="relative z-10 flex flex-col justify-end w-full h-full text-left pointer-events-none">
            <span className="text-[11px] tracking-widest uppercase font-mono text-indigo-300">
              Global Macro & BIS Clearing Protocol · Basel II
            </span>
          </div>
        </div>
      );

    case 'culture':
      return (
        <div
          className={`relative w-full overflow-hidden bg-gradient-to-br from-[#451A03] via-[#292524] to-[#1C1917] text-white flex items-center justify-center p-6 ${aspectClass} ${className}`}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-40"
            viewBox="0 0 800 450"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Geometric mosaic mandala / arch motifs */}
            <circle cx="400" cy="225" r="160" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.6" />
            <circle cx="400" cy="225" r="120" stroke="#FDE68A" strokeWidth="0.8" strokeDasharray="4 4" strokeOpacity="0.5" />
            <circle cx="400" cy="225" r="80" stroke="#FDE68A" strokeWidth="1.2" strokeOpacity="0.8" />
            {/* Diamond stars */}
            <polygon points="400,65 440,225 400,385 360,225" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.4" fill="none" />
            <polygon points="240,225 400,185 560,225 400,265" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.4" fill="none" />
          </svg>
          <div className="relative z-10 flex flex-col justify-end w-full h-full text-left pointer-events-none">
            <span className="text-[11px] tracking-widest uppercase font-mono text-amber-300">
              Archaeological Heritage Archive · Bukhara Oasis
            </span>
          </div>
        </div>
      );

    case 'space':
      return (
        <div
          className={`relative w-full overflow-hidden bg-gradient-to-br from-[#09090B] via-[#0F172A] to-[#18181B] text-white flex items-center justify-center p-6 ${aspectClass} ${className}`}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-45"
            viewBox="0 0 800 450"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Moon crescent */}
            <path
              d="M 680 80 A 60 60 0 1 0 680 200 A 45 45 0 0 1 680 80 Z"
              fill="#E4E4E7"
              fillOpacity="0.85"
            />
            {/* Earth silhouette on left */}
            <circle cx="80" cy="380" r="140" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.6" fill="#0284C7" fillOpacity="0.15" />
            {/* Laser beam connecting orbit */}
            <line x1="650" y1="140" x2="160" y2="340" stroke="#F43F5E" strokeWidth="2" strokeDasharray="8 4" />
            <circle cx="650" cy="140" r="4" fill="#F43F5E" />
            <circle cx="160" cy="340" r="5" fill="#38BDF8" />
          </svg>
          <div className="relative z-10 flex flex-col justify-end w-full h-full text-left pointer-events-none">
            <span className="text-[11px] tracking-widest uppercase font-mono text-rose-300">
              Deep Space Optical Telemetry · Lunar Gateway
            </span>
          </div>
        </div>
      );

    case 'infrastructure':
      return (
        <div
          className={`relative w-full overflow-hidden bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#451A03] text-white flex items-center justify-center p-6 ${aspectClass} ${className}`}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-40"
            viewBox="0 0 800 450"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Railway tracks vanishing into distance */}
            <line x1="100" y1="450" x2="380" y2="180" stroke="#D97706" strokeWidth="2" />
            <line x1="700" y1="450" x2="420" y2="180" stroke="#D97706" strokeWidth="2" />
            {/* Track sleepers */}
            {[420, 370, 320, 280, 240, 210, 190].map((y, i) => {
              const width = (y - 180) * 2.2;
              return (
                <line
                  key={i}
                  x1={400 - width / 2}
                  y1={y}
                  x2={400 + width / 2}
                  y2={y}
                  stroke="white"
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                />
              );
            })}
            {/* Great rift mountain ridge */}
            <path
              d="M 0 240 L 150 170 L 320 220 L 460 160 L 650 210 L 800 170 L 800 450 L 0 450 Z"
              fill="white"
              fillOpacity="0.04"
            />
          </svg>
          <div className="relative z-10 flex flex-col justify-end w-full h-full text-left pointer-events-none">
            <span className="text-[11px] tracking-widest uppercase font-mono text-amber-400">
              Great Rift Electric Rail Corridor · East Africa
            </span>
          </div>
        </div>
      );

    case 'entertainment':
      return (
        <div
          className={`relative w-full overflow-hidden bg-gradient-to-br from-[#2E1065] via-[#1E1B4B] to-[#0F172A] text-white flex items-center justify-center p-6 ${aspectClass} ${className}`}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-40"
            viewBox="0 0 800 450"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Cinema projector cone & cinematic film frame */}
            <polygon points="120,225 720,80 720,370" fill="#C084FC" fillOpacity="0.12" />
            <circle cx="120" cy="225" r="45" stroke="#C084FC" strokeWidth="1.5" />
            <circle cx="120" cy="225" r="15" fill="#E879F9" fillOpacity="0.4" />
            {/* Projector rays */}
            <line x1="120" y1="225" x2="720" y2="80" stroke="#E879F9" strokeWidth="1" strokeDasharray="6 6" />
            <line x1="120" y1="225" x2="720" y2="370" stroke="#E879F9" strokeWidth="1" strokeDasharray="6 6" />
            {/* Film frame grid */}
            <rect x="520" y="110" width="180" height="230" rx="4" stroke="#F472B6" strokeWidth="1.5" fill="none" />
            {[140, 190, 240, 290].map((y, i) => (
              <line key={i} x1="520" y1={y} x2="700" y2={y} stroke="#F472B6" strokeWidth="0.5" strokeDasharray="3 3" />
            ))}
          </svg>
          <div className="relative z-10 flex flex-col justify-end w-full h-full text-left pointer-events-none">
            <span className="text-[11px] tracking-widest uppercase font-mono text-purple-300">
              International Arts & Cinema · Cannes & Venice Wire
            </span>
          </div>
        </div>
      );

    case 'sports':
      return (
        <div
          className={`relative w-full overflow-hidden bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#14532D] text-white flex items-center justify-center p-6 ${aspectClass} ${className}`}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-40"
            viewBox="0 0 800 450"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Athletic stadium oval running tracks */}
            <ellipse cx="400" cy="225" rx="320" ry="150" stroke="#4ADE80" strokeWidth="1" />
            <ellipse cx="400" cy="225" rx="270" ry="120" stroke="#4ADE80" strokeWidth="1" strokeDasharray="4 4" />
            <ellipse cx="400" cy="225" rx="220" ry="90" stroke="#4ADE80" strokeWidth="1.5" />
            <ellipse cx="400" cy="225" rx="170" ry="60" stroke="#4ADE80" strokeWidth="1" strokeDasharray="3 3" />
            {/* Center line and pitch circle */}
            <line x1="400" y1="135" x2="400" y2="315" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" />
            <circle cx="400" cy="225" r="30" stroke="white" strokeWidth="1" strokeOpacity="0.8" />
          </svg>
          <div className="relative z-10 flex flex-col justify-end w-full h-full text-left pointer-events-none">
            <span className="text-[11px] tracking-widest uppercase font-mono text-emerald-300">
              Global Championship Athletics · World Tour Dispatch
            </span>
          </div>
        </div>
      );

    case 'health':
    default:
      return (
        <div
          className={`relative w-full overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#042F2E] text-white flex items-center justify-center p-6 ${aspectClass} ${className}`}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-35"
            viewBox="0 0 800 450"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* DNA double helix / molecular structure */}
            <path
              d="M 100 225 Q 250 140 400 225 T 700 225"
              stroke="#2DD4BF"
              strokeWidth="2"
            />
            <path
              d="M 100 225 Q 250 310 400 225 T 700 225"
              stroke="#14B8A6"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {[180, 260, 340, 420, 500, 580, 660].map((x, i) => (
              <line key={i} x1={x} y1="170" x2={x} y2="280" stroke="white" strokeWidth="0.8" strokeOpacity="0.25" />
            ))}
          </svg>
          <div className="relative z-10 flex flex-col justify-end w-full h-full text-left pointer-events-none">
            <span className="text-[11px] tracking-widest uppercase font-mono text-teal-300">
              Global Health & Molecular Genomics Research
            </span>
          </div>
        </div>
      );
  }
};
