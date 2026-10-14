import React, { useState } from 'react';
import { Language, NewsCategory, Region } from '../types/news';
import { SUPPORTED_LANGUAGES, UIStrings } from '../data/languages';
import { Globe, Bookmark, Radio, Search, Moon, Sun, ChevronDown, Mail, Menu, X, Check } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  activeCategory: NewsCategory;
  onSelectCategory: (cat: NewsCategory) => void;
  activeRegion: Region;
  onSelectRegion: (reg: Region) => void;
  ui: UIStrings;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenAudioBriefing: () => void;
  onScrollToDigest?: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onFocusSearch: () => void;
  currentView: 'portal' | 'my-news';
  onSelectView: (view: 'portal' | 'my-news') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onSelectLanguage,
  activeCategory,
  onSelectCategory,
  ui,
  savedCount,
  onOpenSaved,
  onOpenAudioBriefing,
  onScrollToDigest,
  darkMode,
  onToggleDarkMode,
  onFocusSearch,
  currentView,
  onSelectView,
}) => {
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories: { id: NewsCategory; label: string }[] = [
    { id: 'all', label: ui.categories.all },
    { id: 'world', label: ui.categories.world },
    { id: 'politics', label: ui.categories.politics },
    { id: 'business', label: ui.categories.business },
    { id: 'tech', label: ui.categories.tech },
    { id: 'sports', label: ui.categories.sports },
    { id: 'entertainment', label: ui.categories.entertainment },
    { id: 'science', label: ui.categories.science },
    { id: 'climate', label: ui.categories.climate },
    { id: 'culture', label: ui.categories.culture },
    { id: 'health', label: ui.categories.health },
    { id: 'opinion', label: ui.categories.opinion },
  ];

  const currentLangConfig =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const todayStr = new Intl.DateTimeFormat(currentLangConfig.speechLang, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 transition-colors sticky top-0 z-40">
      {/* Editorial Top Bar strictly complying with 3-zone contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-8 h-16 border-b border-stone-100 dark:border-stone-800">
          {/* Zone 1: Masthead Brand Logo with Heraldic Seal */}
          <button
            onClick={() => {
              onSelectView('portal');
              onSelectCategory('all');
            }}
            className="text-left group cursor-pointer"
            aria-label="THE GLOBAL CHRONICLES Home"
          >
            <BrandLogo variant="header" showTagline={true} />
          </button>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-700 dark:text-stone-300">
            <button
              onClick={() => {
                onSelectView('portal');
                onSelectCategory('all');
              }}
              className={`hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-1 ${
                currentView === 'portal' && activeCategory === 'all' ? 'text-[#9A3412] font-semibold underline' : ''
              }`}
            >
              {ui.categories.all}
            </button>
            <button
              onClick={() => onSelectView('my-news')}
              className={`hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-1 flex items-center gap-1.5 ${
                currentView === 'my-news' ? 'text-[#9A3412] font-semibold underline' : ''
              }`}
            >
              <span>{ui.myNews}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A3412]" />
            </button>
            <button
              onClick={() => {
                onSelectView('portal');
                onSelectCategory('tech');
              }}
              className={`hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-1 ${
                currentView === 'portal' && activeCategory === 'tech' ? 'text-[#9A3412] font-semibold underline' : ''
              }`}
            >
              {ui.categories.tech}
            </button>
            <button
              onClick={() => {
                onSelectView('portal');
                onSelectCategory('sports');
              }}
              className={`hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-1 ${
                currentView === 'portal' && activeCategory === 'sports' ? 'text-[#9A3412] font-semibold underline' : ''
              }`}
            >
              {ui.categories.sports}
            </button>
            <button
              onClick={() => {
                onSelectView('portal');
                onSelectCategory('entertainment');
              }}
              className={`hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-1 ${
                currentView === 'portal' && activeCategory === 'entertainment' ? 'text-[#9A3412] font-semibold underline' : ''
              }`}
            >
              {ui.categories.entertainment}
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action Area with Language Switcher & Utilities */}
          {/* Zone 3: Primary Action Area with Language Switcher & Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Search trigger */}
            <button
              onClick={onFocusSearch}
              className="p-1.5 sm:p-2 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
              title="Search"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Daily Digest opt-in trigger */}
            {onScrollToDigest && (
              <button
                onClick={onScrollToDigest}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0"
                title="Global Daily Digest"
              >
                <Mail className="w-3.5 h-3.5 text-[#9A3412]" />
                <span>Daily Digest</span>
              </button>
            )}

            {/* Audio bulletin button */}
            <button
              onClick={onOpenAudioBriefing}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0"
              title={ui.audioBriefingTitle}
            >
              <Radio className="w-3.5 h-3.5 text-[#9A3412]" />
              <span>{ui.listenBriefing}</span>
            </button>

            {/* Reading list button */}
            <button
              onClick={onOpenSaved}
              className="relative p-1.5 sm:p-2 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
              title={ui.savedArticles}
              aria-label={ui.savedArticles}
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#9A3412] text-white font-mono text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Dark mode toggle with explicit styling */}
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 sm:p-2 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-stone-700 dark:text-stone-300" />}
            </button>

            {/* Multilingual Selector Popover */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-none hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors whitespace-nowrap shrink-0"
                aria-expanded={isLangDropdownOpen}
                aria-haspopup="listbox"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="font-semibold hidden sm:inline">{currentLangConfig.localName}</span>
                <span className="font-semibold sm:hidden uppercase text-[11px]">{currentLangConfig.code}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {isLangDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsLangDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl z-40 py-1 text-sm animate-in fade-in duration-150">
                    <div className="px-3 py-1.5 border-b border-stone-100 dark:border-stone-800 text-[11px] font-mono uppercase tracking-wider text-stone-500">
                      Select Portal Language
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {SUPPORTED_LANGUAGES.map((lang) => {
                        const isSelected = lang.code === currentLanguage;
                        return (
                          <button
                            key={lang.code}
                            onClick={() => {
                              onSelectLanguage(lang.code);
                              setIsLangDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2 flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-stone-100 dark:bg-stone-800 font-semibold text-[#9A3412]'
                                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{lang.flag}</span>
                              <span>{lang.localName}</span>
                            </span>
                            <span className="text-xs text-stone-400 font-mono">
                              {lang.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-1.5 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white border border-stone-200 dark:border-stone-800 transition-colors"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              title="Editorial Sections Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 text-[#9A3412]" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Operational BroadSheet Sub-ribbon with Today's Date & Motto */}
        <div className="py-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 gap-1 font-sans">
          <div className="flex items-center gap-3">
            <span className="font-serif italic font-medium text-stone-700 dark:text-stone-300">
              {todayStr}
            </span>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#9A3412]">
              {ui.edition}
            </span>
          </div>
          <div className="hidden md:block italic text-[11px] font-serif truncate">
            {ui.brandTagline}
          </div>
        </div>

        {/* Category Broadsheet Navigation Rail */}
        <div className="flex items-center overflow-x-auto no-scrollbar gap-1 py-1 text-xs">
          <button
            onClick={() => onSelectView('my-news')}
            className={`px-3 py-1.5 whitespace-nowrap shrink-0 transition-colors font-semibold border-b-2 flex items-center gap-1.5 ${
              currentView === 'my-news'
                ? 'border-[#9A3412] text-[#9A3412]'
                : 'border-transparent text-[#9A3412] hover:text-[#7C2D12]'
            }`}
          >
            <span>★ {ui.myNews}</span>
          </button>
          {categories.map((cat) => {
            const isActive = currentView === 'portal' && activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectView('portal');
                  onSelectCategory(cat.id);
                }}
                className={`px-3 py-1.5 whitespace-nowrap shrink-0 transition-colors font-medium border-b-2 ${
                  isActive
                    ? 'border-[#9A3412] text-[#9A3412] font-semibold'
                    : 'border-transparent text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-start animate-in fade-in duration-150">
          <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 max-h-[85vh] overflow-y-auto p-5 shadow-2xl flex flex-col gap-5">
            {/* Quick Actions Panel */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {/* Theme Toggle Button */}
              <button
                onClick={() => {
                  onToggleDarkMode();
                }}
                className="flex items-center justify-between p-3 border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200"
              >
                <span className="flex items-center gap-2">
                  {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-stone-700" />}
                  <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </span>
                <span className="text-[10px] text-stone-400 uppercase">{darkMode ? 'ON' : 'OFF'}</span>
              </button>

              {/* My News Button */}
              <button
                onClick={() => {
                  onSelectView('my-news');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-3 border ${
                  currentView === 'my-news'
                    ? 'border-[#9A3412] bg-[#9A3412]/10 text-[#9A3412] font-bold'
                    : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200'
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span>★</span>
                  <span>{ui.myNews}</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#9A3412]" />
              </button>

              {/* Daily Digest */}
              {onScrollToDigest && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onScrollToDigest();
                  }}
                  className="flex items-center gap-2 p-3 border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200"
                >
                  <Mail className="w-4 h-4 text-[#9A3412]" />
                  <span>Daily Digest</span>
                </button>
              )}

              {/* Audio Brief */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAudioBriefing();
                }}
                className="flex items-center gap-2 p-3 border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200"
              >
                <Radio className="w-4 h-4 text-[#9A3412]" />
                <span className="truncate">{ui.listenBriefing}</span>
              </button>
            </div>

            {/* Language Switcher in Mobile Drawer */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block mb-2">
                Reading Language ({SUPPORTED_LANGUAGES.length} Languages)
              </span>
              <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = lang.code === currentLanguage;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelectLanguage(lang.code);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-left px-2.5 py-1.5 text-xs flex items-center justify-between border transition-colors ${
                        isSelected
                          ? 'border-[#9A3412] bg-[#9A3412]/10 font-bold text-[#9A3412]'
                          : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span>{lang.flag}</span>
                        <span className="truncate">{lang.localName}</span>
                      </span>
                      {isSelected && <Check className="w-3 h-3 text-[#9A3412] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Editorial Sections List */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block mb-2">
                Editorial Sections
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {categories.map((cat) => {
                  const isActive = currentView === 'portal' && activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectView('portal');
                        onSelectCategory(cat.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-left px-3 py-2 text-xs font-medium border transition-colors ${
                        isActive
                          ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900'
                          : 'bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Close Bar */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-xs font-mono font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 mt-2"
            >
              {ui.close}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
