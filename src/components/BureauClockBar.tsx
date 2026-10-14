import React, { useState, useEffect } from 'react';
import { BureauClock, MarketItem } from '../types/news';
import { UIStrings } from '../data/languages';
import { Clock, TrendingUp, Sun, Cloud, CloudRain } from 'lucide-react';

interface BureauClockBarProps {
  bureaus: BureauClock[];
  markets: MarketItem[];
  ui: UIStrings;
}

export const BureauClockBar: React.FC<BureauClockBarProps> = ({
  bureaus,
  markets,
  ui,
}) => {
  const [activeTab, setActiveTab] = useState<'clocks' | 'markets'>('clocks');
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCityTime = (timezone: string) => {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
    } catch {
      return '--:--:--';
    }
  };

  const getWeatherIcon = (weather: string) => {
    if (weather.toLowerCase().includes('rain') || weather.toLowerCase().includes('shower')) {
      return <CloudRain className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />;
    }
    if (weather.toLowerCase().includes('cloud') || weather.toLowerCase().includes('overcast')) {
      return <Cloud className="w-3.5 h-3.5 text-stone-500" />;
    }
    return <Sun className="w-3.5 h-3.5 text-amber-500" />;
  };

  return (
    <div className="border-b border-stone-200 dark:border-stone-800 bg-[#F5F2EB] dark:bg-stone-950 text-stone-700 dark:text-stone-300 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-2 py-1.5">
        {/* Toggle tabs */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('clocks')}
            className={`flex items-center gap-1.5 py-1 px-2.5 transition-colors font-medium border-b-2 -mb-[7px] ${
              activeTab === 'clocks'
                ? 'border-stone-900 text-stone-900 dark:border-stone-100 dark:text-stone-100'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider text-[11px] font-mono">{ui.bureauClocks}</span>
          </button>
          <button
            onClick={() => setActiveTab('markets')}
            className={`flex items-center gap-1.5 py-1 px-2.5 transition-colors font-medium border-b-2 -mb-[7px] ${
              activeTab === 'markets'
                ? 'border-stone-900 text-stone-900 dark:border-stone-100 dark:text-stone-100'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider text-[11px] font-mono">{ui.marketData}</span>
          </button>
        </div>

        {/* Content stream */}
        <div className="overflow-x-auto no-scrollbar flex items-center gap-5 py-0.5">
          {activeTab === 'clocks' ? (
            bureaus.map((bureau) => {
              const timeStr = formatCityTime(bureau.timezone);
              return (
                <div
                  key={bureau.city}
                  className="flex items-center gap-2 whitespace-nowrap text-[12px] shrink-0 font-sans"
                >
                  <span className="font-semibold text-stone-900 dark:text-stone-100">{bureau.city}</span>
                  <span className="font-mono text-stone-600 dark:text-stone-400 tabular-nums">
                    {timeStr}
                  </span>
                  <span className="text-stone-300 dark:text-stone-700">·</span>
                  <span className="flex items-center gap-1 text-[11px] text-stone-500">
                    {getWeatherIcon(bureau.weather)}
                    <span>{bureau.tempC}°C</span>
                  </span>
                  <span className="text-stone-300 dark:text-stone-700">|</span>
                </div>
              );
            })
          ) : (
            markets.map((market) => (
              <div
                key={market.id}
                className="flex items-center gap-2 whitespace-nowrap text-[12px] shrink-0 font-mono"
              >
                <span className="font-semibold text-stone-900 dark:text-stone-100">{market.symbol}</span>
                <span className="text-stone-700 dark:text-stone-300 tabular-nums">{market.value}</span>
                <span
                  className={`text-[11px] font-medium tabular-nums ${
                    market.isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                  }`}
                >
                  {market.change}
                </span>
                <span className="text-stone-300 dark:text-stone-700">|</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
