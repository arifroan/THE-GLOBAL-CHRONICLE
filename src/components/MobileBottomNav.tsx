import React from 'react';
import { Newspaper, Star, Search, Radio, Bookmark, Moon, Sun } from 'lucide-react';
import { UIStrings } from '../data/languages';
import { NewsCategory } from '../types/news';

interface MobileBottomNavProps {
  currentView: 'portal' | 'my-news';
  onSelectView: (view: 'portal' | 'my-news') => void;
  activeCategory: NewsCategory;
  onSelectCategory: (cat: NewsCategory) => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenAudioBriefing: () => void;
  onFocusSearch: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  ui: UIStrings;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onSelectView,
  activeCategory,
  onSelectCategory,
  savedCount,
  onOpenSaved,
  onOpenAudioBriefing,
  onFocusSearch,
  darkMode,
  onToggleDarkMode,
  ui,
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-2 py-1.5 shadow-lg transition-colors"
      style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around text-stone-600 dark:text-stone-400">
        {/* Front Page */}
        <button
          onClick={() => {
            onSelectView('portal');
            onSelectCategory('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[50px] transition-colors ${
            currentView === 'portal' && activeCategory === 'all'
              ? 'text-[#9A3412] font-bold'
              : 'hover:text-stone-950 dark:hover:text-stone-100'
          }`}
          aria-label={ui.categories.all}
        >
          <Newspaper className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-mono leading-none">{ui.categories.all}</span>
        </button>

        {/* My News */}
        <button
          onClick={() => {
            onSelectView('my-news');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[50px] relative transition-colors ${
            currentView === 'my-news'
              ? 'text-[#9A3412] font-bold'
              : 'hover:text-stone-950 dark:hover:text-stone-100'
          }`}
          aria-label={ui.myNews}
        >
          <div className="relative">
            <Star className="w-4 h-4 mb-0.5" />
            <span className="absolute -top-0.5 -right-1 w-1.5 h-1.5 rounded-full bg-[#9A3412]" />
          </div>
          <span className="text-[10px] font-mono leading-none">{ui.myNews}</span>
        </button>

        {/* Search */}
        <button
          onClick={onFocusSearch}
          className="flex flex-col items-center justify-center p-1.5 min-w-[50px] hover:text-stone-950 dark:hover:text-stone-100 transition-colors"
          aria-label="Search"
        >
          <Search className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-mono leading-none">Search</span>
        </button>

        {/* Audio Brief */}
        <button
          onClick={onOpenAudioBriefing}
          className="flex flex-col items-center justify-center p-1.5 min-w-[50px] hover:text-stone-950 dark:hover:text-stone-100 transition-colors"
          aria-label={ui.listenBriefing}
        >
          <Radio className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-mono leading-none">Audio</span>
        </button>

        {/* Saved Reading List */}
        <button
          onClick={onOpenSaved}
          className="flex flex-col items-center justify-center p-1.5 min-w-[50px] relative hover:text-stone-950 dark:hover:text-stone-100 transition-colors"
          aria-label={ui.savedArticles}
        >
          <div className="relative">
            <Bookmark className="w-4 h-4 mb-0.5" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#9A3412] text-white font-mono text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                {savedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono leading-none">{ui.savedArticles}</span>
        </button>

        {/* Dark/Light Mode Direct Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="flex flex-col items-center justify-center p-1.5 min-w-[50px] hover:text-stone-950 dark:hover:text-stone-100 transition-colors"
          aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={darkMode ? 'Switch to Light' : 'Switch to Dark'}
        >
          {darkMode ? (
            <Sun className="w-4 h-4 mb-0.5 text-amber-500" />
          ) : (
            <Moon className="w-4 h-4 mb-0.5 text-stone-700" />
          )}
          <span className="text-[10px] font-mono leading-none">
            {darkMode ? 'Light' : 'Dark'}
          </span>
        </button>
      </div>
    </nav>
  );
};
