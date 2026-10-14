import React, { useState, useEffect } from 'react';
import { Article, Language } from '../types/news';
import { UIStrings } from '../data/languages';
import { ChevronLeft, ChevronRight, Pause, Play, AlertCircle } from 'lucide-react';

interface BreakingTickerProps {
  articles: Article[];
  currentLanguage: Language;
  ui: UIStrings;
  onSelectArticle: (article: Article) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({
  articles,
  currentLanguage,
  ui,
  onSelectArticle,
}) => {
  const breakingStories = articles.filter(
    (a) => a.importance === 'lead' || a.importance === 'breaking'
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (breakingStories.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingStories.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [breakingStories.length, isPaused]);

  if (breakingStories.length === 0) return null;

  const currentStory = breakingStories[currentIndex];
  const translation = currentStory.translations[currentLanguage] || currentStory.translations.en;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + breakingStories.length) % breakingStories.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % breakingStories.length);
  };

  const handleTogglePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused((prev) => !prev);
  };

  return (
    <div className="bg-[#9A3412] text-white border-b border-[#7C2D12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3 text-sm">
        {/* Urgent label */}
        <div className="flex items-center gap-2 shrink-0">
          <AlertCircle className="w-4 h-4 text-amber-200 animate-pulse" />
          <span className="font-mono text-xs uppercase font-bold tracking-wider bg-black/20 px-2 py-0.5">
            {ui.breaking}
          </span>
          <span className="hidden sm:inline text-xs opacity-75 font-mono">
            [{currentIndex + 1}/{breakingStories.length}]
          </span>
        </div>

        {/* Ticker text */}
        <div
          onClick={() => onSelectArticle(currentStory)}
          className="flex-1 truncate cursor-pointer hover:underline text-xs sm:text-sm font-sans font-medium flex items-center gap-2"
        >
          <span className="font-serif font-bold text-amber-100 shrink-0">
            {currentStory.city}:
          </span>
          <span className="truncate">{translation.title}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleTogglePause}
            className="p-1 hover:bg-black/20 text-white/90 transition-colors"
            title={isPaused ? 'Resume' : 'Pause'}
            aria-label="Pause/Resume"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handlePrev}
            className="p-1 hover:bg-black/20 text-white/90 transition-colors"
            title="Previous"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="p-1 hover:bg-black/20 text-white/90 transition-colors"
            title="Next"
            aria-label="Next story"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
