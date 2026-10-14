import React, { useState } from 'react';
import { Article, Language, NewsCategory, UserFeedConfig } from '../types/news';
import { UIStrings } from '../data/languages';
import { EditorialCard } from './EditorialCard';
import { GlobalDailyDigest } from './GlobalDailyDigest';
import { getDistinctSources } from '../utils/rankingAlgorithm';
import {
  SlidersHorizontal,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Filter,
  Search,
  CheckSquare,
  Square,
  ShieldCheck,
} from 'lucide-react';

interface MyNewsPageProps {
  articles: Article[];
  currentLanguage: Language;
  ui: UIStrings;
  feedConfig: UserFeedConfig;
  onUpdateFeedConfig: (newConfig: UserFeedConfig) => void;
  onSelectArticle: (article: Article) => void;
  savedIds: string[];
  onToggleSave: (article: Article, e: React.MouseEvent) => void;
  onShare: (article: Article, e: React.MouseEvent) => void;
}

export const MyNewsPage: React.FC<MyNewsPageProps> = ({
  articles,
  currentLanguage,
  ui,
  feedConfig,
  onUpdateFeedConfig,
  onSelectArticle,
  savedIds,
  onToggleSave,
  onShare,
}) => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [localCategories, setLocalCategories] = useState<NewsCategory[]>(feedConfig.selectedCategories);
  const [localSources, setLocalSources] = useState<string[]>(feedConfig.selectedSources);
  const [localKeyword, setLocalKeyword] = useState<string>(feedConfig.keywordFilter || '');

  const availableCategories: { id: NewsCategory; label: string }[] = [
    { id: 'tech', label: ui.categories.tech },
    { id: 'sports', label: ui.categories.sports },
    { id: 'politics', label: ui.categories.politics },
    { id: 'entertainment', label: ui.categories.entertainment },
    { id: 'business', label: ui.categories.business },
    { id: 'climate', label: ui.categories.climate },
    { id: 'world', label: ui.categories.world },
    { id: 'science', label: ui.categories.science },
    { id: 'health', label: ui.categories.health },
    { id: 'culture', label: ui.categories.culture },
    { id: 'opinion', label: ui.categories.opinion },
  ];

  const availableSources = getDistinctSources(articles);

  const toggleCategory = (cat: NewsCategory) => {
    setLocalCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleSource = (sourceName: string) => {
    setLocalSources((prev) =>
      prev.includes(sourceName)
        ? prev.filter((s) => s !== sourceName)
        : [...prev, sourceName]
    );
  };

  const handleSelectAllCategories = () => {
    setLocalCategories(availableCategories.map((c) => c.id));
  };

  const handleSelectAllSources = () => {
    setLocalSources(availableSources.map((s) => s.name));
  };

  const handleResetToDefault = () => {
    const defaults: NewsCategory[] = ['tech', 'sports', 'politics', 'entertainment', 'business', 'climate'];
    setLocalCategories(defaults);
    setLocalSources(availableSources.map((s) => s.name));
    setLocalKeyword('');
  };

  const handleSavePreferences = () => {
    onUpdateFeedConfig({
      selectedCategories: localCategories.length === 0 ? availableCategories.map((c) => c.id) : localCategories,
      selectedSources: localSources.length === 0 ? availableSources.map((s) => s.name) : localSources,
      keywordFilter: localKeyword,
      minScore: feedConfig.minScore || 0,
    });
    setIsCustomizing(false);
  };

  // Filter articles according to user's feedConfig
  const customizedArticles = articles.filter((a) => {
    // Category check
    if (feedConfig.selectedCategories.length > 0 && !feedConfig.selectedCategories.includes(a.category)) {
      return false;
    }
    // Source check
    if (feedConfig.selectedSources.length > 0 && !feedConfig.selectedSources.includes(a.source)) {
      return false;
    }
    // Keyword check
    if (feedConfig.keywordFilter && feedConfig.keywordFilter.trim()) {
      const q = feedConfig.keywordFilter.toLowerCase().trim();
      const trans = a.translations[currentLanguage] || a.translations.en;
      const matches =
        trans.title.toLowerCase().includes(q) ||
        trans.summary.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q));
      if (!matches) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* Header Banner */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-8 mb-8 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#9A3412] uppercase tracking-widest font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>Personalized Edition</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-950 dark:text-stone-50 mt-1">
              {ui.myNews}
            </h1>
            <p className="text-sm font-serif italic text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
              {ui.myNewsDesc}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCustomizing((prev) => !prev)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium border transition-colors ${
                isCustomizing
                  ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:bg-stone-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#9A3412]" />
              <span>{isCustomizing ? 'Hide Feed Customizer' : ui.customizeFeed}</span>
            </button>
          </div>
        </div>

        {/* Active Configuration Quick Tags (Zero-Pill discipline: unboxed text with separators) */}
        <div className="pt-4 flex items-center flex-wrap gap-2 text-xs font-mono text-stone-500 dark:text-stone-400">
          <span className="font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
            Active Feed Filters:
          </span>
          <span>
            {feedConfig.selectedCategories.length} Categories ({feedConfig.selectedCategories.map((c) => ui.categories[c] || c).join(', ')})
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {feedConfig.selectedSources.length} Sources ({feedConfig.selectedSources.slice(0, 3).join(', ')}{feedConfig.selectedSources.length > 3 ? ` +${feedConfig.selectedSources.length - 3}` : ''})
          </span>
          {feedConfig.keywordFilter && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-[#9A3412]">Keyword: "{feedConfig.keywordFilter}"</span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span className="text-stone-900 dark:text-stone-100 font-bold">
            {customizedArticles.length} Stories Available
          </span>
        </div>
      </div>

      {/* Customizable Drawer / Panel */}
      {isCustomizing && (
        <div className="bg-[#F7F4EE] dark:bg-stone-950 border border-stone-300 dark:border-stone-800 p-6 sm:p-8 mb-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-stone-300 dark:border-stone-800 mb-6">
            <h3 className="font-editorial text-xl font-bold text-stone-950 dark:text-stone-50">
              Customize Your Global Feed
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetToDefault}
                className="text-xs font-mono text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Standard</span>
              </button>
            </div>
          </div>

          {/* Section 1: Categories Multi-Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-widest font-bold text-stone-700 dark:text-stone-300">
                1. Select Topics & Categories ({localCategories.length} selected)
              </span>
              <button
                onClick={handleSelectAllCategories}
                className="text-xs font-mono text-[#9A3412] hover:underline"
              >
                Select All
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {availableCategories.map((cat) => {
                const isChecked = localCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-2 text-xs font-mono flex items-center justify-between border transition-colors text-left ${
                      isChecked
                        ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {isChecked ? <CheckSquare className="w-3.5 h-3.5 shrink-0" /> : <Square className="w-3.5 h-3.5 shrink-0 opacity-40" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Verified Sources Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-widest font-bold text-stone-700 dark:text-stone-300">
                2. Select News Agencies & Publications ({localSources.length} selected)
              </span>
              <button
                onClick={handleSelectAllSources}
                className="text-xs font-mono text-[#9A3412] hover:underline"
              >
                Select All Sources
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {availableSources.map((source) => {
                const isChecked = localSources.includes(source.name);
                return (
                  <button
                    key={source.name}
                    onClick={() => toggleSource(source.name)}
                    className={`px-3 py-2 text-xs font-mono flex items-center justify-between border transition-colors text-left ${
                      isChecked
                        ? 'bg-[#9A3412] text-white border-[#7C2D12]'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700'
                    }`}
                  >
                    <span className="truncate mr-1">{source.name}</span>
                    <span className="text-[10px] opacity-75 font-mono">{source.authority}/100</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Keyword Search Filter */}
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-widest font-bold text-stone-700 dark:text-stone-300 block mb-2">
              3. Custom Keyword Focus (Optional)
            </span>
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={localKeyword}
                onChange={(e) => setLocalKeyword(e.target.value)}
                placeholder="e.g. quantum, solar, diplomacy, lithium, AI..."
                className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:border-[#9A3412]"
              />
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-4 border-t border-stone-300 dark:border-stone-800 flex items-center justify-end gap-3">
            <button
              onClick={() => setIsCustomizing(false)}
              className="px-4 py-2 text-xs font-mono text-stone-600 dark:text-stone-400 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePreferences}
              className="px-6 py-2 bg-[#9A3412] hover:bg-[#B45309] text-white font-mono font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{ui.saveFeedPreferences}</span>
            </button>
          </div>
        </div>
      )}

      {/* Feed Articles Stream */}
      {customizedArticles.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 my-6">
          <Filter className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="font-editorial text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
            No Stories Found for Current Filters
          </h3>
          <p className="text-sm font-serif italic text-stone-500 dark:text-stone-400 max-w-md mx-auto mb-6">
            {ui.noCustomArticles}
          </p>
          <button
            onClick={() => {
              handleResetToDefault();
              handleSavePreferences();
            }}
            className="px-5 py-2.5 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-mono text-xs font-bold hover:bg-[#9A3412] transition-colors"
          >
            Reset to All Categories & Sources
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customizedArticles.map((article) => (
            <EditorialCard
              key={article.id}
              article={article}
              currentLanguage={currentLanguage}
              ui={ui}
              variant="standard"
              isSaved={savedIds.includes(article.id)}
              onSelectArticle={onSelectArticle}
              onToggleSave={onToggleSave}
              onShare={onShare}
            />
          ))}
        </div>
      )}

      {/* Embedded Global Daily Digest Component */}
      <div className="mt-12">
        <GlobalDailyDigest
          articles={articles}
          currentLanguage={currentLanguage}
          ui={ui}
          onSelectArticle={onSelectArticle}
        />
      </div>
    </div>
  );
};
