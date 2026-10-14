import React from 'react';
import { Region } from '../types/news';
import { UIStrings } from '../data/languages';

interface InteractiveWorldMapProps {
  activeRegion: Region;
  onSelectRegion: (region: Region) => void;
  ui: UIStrings;
  articleCountsByRegion: Record<Region, number>;
}

export const InteractiveWorldMap: React.FC<InteractiveWorldMapProps> = ({
  activeRegion,
  onSelectRegion,
  ui,
  articleCountsByRegion,
}) => {
  const regions: { id: Region; label: string; x: number; y: number; code: string }[] = [
    { id: 'north-america', label: ui.regions['north-america'], x: 190, y: 120, code: 'NA' },
    { id: 'latin-america', label: ui.regions['latin-america'], x: 260, y: 260, code: 'LA' },
    { id: 'europe', label: ui.regions['europe'], x: 440, y: 105, code: 'EU' },
    { id: 'middle-east', label: ui.regions['middle-east'], x: 505, y: 165, code: 'ME' },
    { id: 'africa', label: ui.regions['africa'], x: 450, y: 220, code: 'AF' },
    { id: 'asia-pacific', label: ui.regions['asia-pacific'], x: 670, y: 155, code: 'AP' },
  ];

  return (
    <div className="bg-white border border-stone-200 dark:bg-stone-900 dark:border-stone-800 p-5 mb-8 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 mb-4 gap-2">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-mono text-stone-500">
            {ui.interactiveGlobe}
          </span>
          <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
            {ui.worldMap}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectRegion('all')}
            className={`text-xs px-3 py-1.5 font-medium transition-colors border ${
              activeRegion === 'all'
                ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700'
            }`}
          >
            {ui.allRegions} ({articleCountsByRegion['all'] || 0})
          </button>
        </div>
      </div>

      <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] bg-[#F7F4EE] dark:bg-stone-950 overflow-hidden border border-stone-200/60 dark:border-stone-800 flex items-center justify-center">
        {/* World map stylized continents vector */}
        <svg
          viewBox="0 0 900 380"
          className="w-full h-full select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle latitude and longitude lines */}
          <line x1="0" y1="190" x2="900" y2="190" stroke="#E2DCD2" dark-stroke="#333" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="0" y1="95" x2="900" y2="95" stroke="#E2DCD2" strokeWidth="0.5" strokeDasharray="2 4" />
          <line x1="0" y1="285" x2="900" y2="285" stroke="#E2DCD2" strokeWidth="0.5" strokeDasharray="2 4" />
          <line x1="450" y1="0" x2="450" y2="380" stroke="#E2DCD2" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="225" y1="0" x2="225" y2="380" stroke="#E2DCD2" strokeWidth="0.5" strokeDasharray="2 4" />
          <line x1="675" y1="0" x2="675" y2="380" stroke="#E2DCD2" strokeWidth="0.5" strokeDasharray="2 4" />

          {/* North America silhouette */}
          <path
            d="M 90 70 Q 150 40 230 60 Q 280 80 270 120 Q 230 140 210 180 Q 170 190 140 140 Q 90 120 90 70 Z"
            className={`cursor-pointer transition-all duration-200 ${
              activeRegion === 'north-america'
                ? 'fill-[#9A3412]/30 stroke-[#9A3412] stroke-[1.5]'
                : 'fill-stone-300/60 dark:fill-stone-800 hover:fill-stone-400/80 stroke-stone-400/60 dark:stroke-stone-700'
            }`}
            onClick={() => onSelectRegion('north-america')}
          />

          {/* Latin America silhouette */}
          <path
            d="M 210 195 Q 260 200 280 240 Q 290 300 260 350 Q 230 350 220 280 Q 200 230 210 195 Z"
            className={`cursor-pointer transition-all duration-200 ${
              activeRegion === 'latin-america'
                ? 'fill-[#9A3412]/30 stroke-[#9A3412] stroke-[1.5]'
                : 'fill-stone-300/60 dark:fill-stone-800 hover:fill-stone-400/80 stroke-stone-400/60 dark:stroke-stone-700'
            }`}
            onClick={() => onSelectRegion('latin-america')}
          />

          {/* Europe silhouette */}
          <path
            d="M 400 70 Q 460 50 480 80 Q 490 110 460 130 Q 420 135 395 110 Q 380 90 400 70 Z"
            className={`cursor-pointer transition-all duration-200 ${
              activeRegion === 'europe'
                ? 'fill-[#9A3412]/30 stroke-[#9A3412] stroke-[1.5]'
                : 'fill-stone-300/60 dark:fill-stone-800 hover:fill-stone-400/80 stroke-stone-400/60 dark:stroke-stone-700'
            }`}
            onClick={() => onSelectRegion('europe')}
          />

          {/* Middle East silhouette */}
          <path
            d="M 480 135 Q 530 130 550 160 Q 540 190 500 190 Q 470 170 480 135 Z"
            className={`cursor-pointer transition-all duration-200 ${
              activeRegion === 'middle-east'
                ? 'fill-[#9A3412]/30 stroke-[#9A3412] stroke-[1.5]'
                : 'fill-stone-300/60 dark:fill-stone-800 hover:fill-stone-400/80 stroke-stone-400/60 dark:stroke-stone-700'
            }`}
            onClick={() => onSelectRegion('middle-east')}
          />

          {/* Africa silhouette */}
          <path
            d="M 400 145 Q 470 140 480 190 Q 480 260 450 310 Q 410 270 390 220 Q 380 170 400 145 Z"
            className={`cursor-pointer transition-all duration-200 ${
              activeRegion === 'africa'
                ? 'fill-[#9A3412]/30 stroke-[#9A3412] stroke-[1.5]'
                : 'fill-stone-300/60 dark:fill-stone-800 hover:fill-stone-400/80 stroke-stone-400/60 dark:stroke-stone-700'
            }`}
            onClick={() => onSelectRegion('africa')}
          />

          {/* Asia & Pacific silhouette */}
          <path
            d="M 520 60 Q 640 40 760 70 Q 790 120 740 180 Q 650 200 580 160 Q 530 110 520 60 Z"
            className={`cursor-pointer transition-all duration-200 ${
              activeRegion === 'asia-pacific'
                ? 'fill-[#9A3412]/30 stroke-[#9A3412] stroke-[1.5]'
                : 'fill-stone-300/60 dark:fill-stone-800 hover:fill-stone-400/80 stroke-stone-400/60 dark:stroke-stone-700'
            }`}
            onClick={() => onSelectRegion('asia-pacific')}
          />

          {/* Australia / Oceania */}
          <path
            d="M 700 250 Q 760 240 770 290 Q 720 320 680 290 Q 680 260 700 250 Z"
            className={`cursor-pointer transition-all duration-200 ${
              activeRegion === 'asia-pacific'
                ? 'fill-[#9A3412]/30 stroke-[#9A3412] stroke-[1.5]'
                : 'fill-stone-300/60 dark:fill-stone-800 hover:fill-stone-400/80 stroke-stone-400/60 dark:stroke-stone-700'
            }`}
            onClick={() => onSelectRegion('asia-pacific')}
          />
        </svg>

        {/* Region hotspot buttons layered above map */}
        <div className="absolute inset-0 pointer-events-none">
          {regions.map((reg) => {
            const isSelected = activeRegion === reg.id;
            const count = articleCountsByRegion[reg.id] || 0;
            return (
              <button
                key={reg.id}
                onClick={() => onSelectRegion(reg.id)}
                style={{ left: `${(reg.x / 900) * 100}%`, top: `${(reg.y / 380) * 100}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto px-2 py-1 text-[11px] font-sans font-medium transition-all shadow-xs border flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#9A3412] text-white border-[#7C2D12] z-20 scale-105'
                    : 'bg-white/95 text-stone-800 border-stone-300 hover:border-stone-500 hover:bg-stone-50 dark:bg-stone-900/90 dark:text-stone-200 dark:border-stone-700 z-10'
                }`}
                title={`Filter by ${reg.label}`}
              >
                <span className="font-mono text-[9px] opacity-75">{reg.code}</span>
                <span>{reg.label}</span>
                <span
                  className={`text-[10px] px-1 py-0.2 rounded-none font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'text-stone-500 dark:text-stone-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
