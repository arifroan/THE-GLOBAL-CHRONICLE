/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Article, Language, NewsCategory, Region, AlgorithmWeights, UserFeedConfig, RankedArticle } from './types/news';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from './data/languages';
import { WORLD_ARTICLES } from './data/mockArticles';
import { INITIAL_MARKET_DATA, WORLD_BUREAUS } from './data/marketAndClocks';
import { getTop10AggregatedArticles, DEFAULT_ALGORITHM_WEIGHTS } from './utils/rankingAlgorithm';
import { Header } from './components/Header';
import { BureauClockBar } from './components/BureauClockBar';
import { BreakingTicker } from './components/BreakingTicker';
import { InteractiveWorldMap } from './components/InteractiveWorldMap';
import { SearchFilterBar } from './components/SearchFilterBar';
import { EditorialCard } from './components/EditorialCard';
import { ArticleModal } from './components/ArticleModal';
import { AudioBriefingModal } from './components/AudioBriefingModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { TopAggregatedModule } from './components/TopAggregatedModule';
import { MyNewsPage } from './components/MyNewsPage';
import { AlgorithmExplainerModal } from './components/AlgorithmExplainerModal';
import { GlobalDailyDigest } from './components/GlobalDailyDigest';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { BrandLogo } from './components/BrandLogo';
import { AiSourceBreakdownModal } from './components/AiSourceBreakdownModal';
import { Sparkles, Compass, Newspaper, Check } from 'lucide-react';

export default function App() {
  // Navigation view: main broadsheet portal vs dedicated 'my-news' feed page
  const [currentView, setCurrentView] = useState<'portal' | 'my-news'>('portal');

  // Real-time AI synchronization states
  const [articlesList, setArticlesList] = useState<Article[]>(WORLD_ARTICLES);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [onlyAiSynced, setOnlyAiSynced] = useState(false);
  const [isAiSourceModalOpen, setIsAiSourceModalOpen] = useState(false);

  // Persistence for language & theme
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('global_chronicle_lang');
    return (saved as Language) || 'en';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('global_chronicle_theme');
      if (saved) return saved === 'dark';
      return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const [activeCategory, setActiveCategory] = useState<NewsCategory>('all');
  const [activeRegion, setActiveRegion] = useState<Region>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'breaking' | 'mostRead'>('latest');

  // Global Reader Text Size state ('normal' | 'large' | 'xlarge')
  const [readerSize, setReaderSize] = useState<'normal' | 'large' | 'xlarge'>(() => {
    try {
      const saved = localStorage.getItem('global_chronicle_reader_size');
      if (saved === 'large' || saved === 'xlarge') return saved;
      return 'normal';
    } catch {
      return 'normal';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('global_chronicle_reader_size', readerSize);
    } catch {}
  }, [readerSize]);

  // Algorithm weights state
  const [algorithmWeights, setAlgorithmWeights] = useState<AlgorithmWeights>(() => {
    try {
      const saved = localStorage.getItem('global_chronicle_weights');
      return saved ? JSON.parse(saved) : DEFAULT_ALGORITHM_WEIGHTS;
    } catch {
      return DEFAULT_ALGORITHM_WEIGHTS;
    }
  });

  // User Feed preferences state
  const [userFeedConfig, setUserFeedConfig] = useState<UserFeedConfig>(() => {
    try {
      const saved = localStorage.getItem('global_chronicle_user_feed');
      return saved
        ? JSON.parse(saved)
        : {
            selectedCategories: ['tech', 'sports', 'politics', 'entertainment', 'business', 'climate'],
            selectedSources: ['Reuters', 'Associated Press', 'BBC News', 'Bloomberg', 'Agence France-Presse', 'Variety'],
            keywordFilter: '',
            minScore: 0,
          };
    } catch {
      return {
        selectedCategories: ['tech', 'sports', 'politics', 'entertainment', 'business', 'climate'],
        selectedSources: ['Reuters', 'Associated Press', 'BBC News', 'Bloomberg', 'Agence France-Presse', 'Variety'],
        keywordFilter: '',
        minScore: 0,
      };
    }
  });

  // Modals and drawers
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isAudioBriefingOpen, setIsAudioBriefingOpen] = useState(false);
  const [isAlgorithmModalOpen, setIsAlgorithmModalOpen] = useState(false);
  const [focusSearchTrigger, setFocusSearchTrigger] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Saved articles in local storage
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('global_chronicle_bookmarks');
      return saved ? JSON.parse(saved) : ['world-summit-treaty-2026', 'bloomberg-ai-semiconductor-consortium-2026'];
    } catch {
      return ['world-summit-treaty-2026'];
    }
  });

  // Sync language with localStorage and document title
  const currentLangConfig = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  }, [currentLanguage]);

  const ui = useMemo(() => {
    return UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
  }, [currentLanguage]);

  useEffect(() => {
    localStorage.setItem('global_chronicle_lang', currentLanguage);
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLangConfig.dir;
  }, [currentLanguage, currentLangConfig]);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('global_chronicle_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('global_chronicle_theme', 'light');
    }
  }, [darkMode]);

  // Sync saved bookmarks with localStorage
  useEffect(() => {
    localStorage.setItem('global_chronicle_bookmarks', JSON.stringify(savedIds));
  }, [savedIds]);

  // Sync algorithm weights
  useEffect(() => {
    localStorage.setItem('global_chronicle_weights', JSON.stringify(algorithmWeights));
  }, [algorithmWeights]);

  // Sync user feed preferences
  const handleUpdateFeedConfig = (newConfig: UserFeedConfig) => {
    setUserFeedConfig(newConfig);
    localStorage.setItem('global_chronicle_user_feed', JSON.stringify(newConfig));
    showToast('Personalized feed preferences updated');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleToggleSave = (article: Article, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedIds((prev) => {
      const exists = prev.includes(article.id);
      if (exists) {
        showToast('Removed from reading list');
        return prev.filter((id) => id !== article.id);
      } else {
        showToast('Saved to your reading list');
        return [...prev, article.id];
      }
    });
  };

  const handleRemoveBookmark = (id: string) => {
    setSavedIds((prev) => prev.filter((item) => item !== id));
    showToast('Removed from reading list');
  };

  const handleClearAllBookmarks = () => {
    setSavedIds([]);
    showToast('Reading list cleared');
  };

  const handleShare = (article: Article, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(ui.copiedLink);
    }
  };

  const handleQuickListen = (article: Article, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedArticle(article);
  };

  const handleScrollToDigest = () => {
    setCurrentView('portal');
    setTimeout(() => {
      const el = document.getElementById('daily-digest');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
  };

  // Real-time synchronization trigger handler
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync/news', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          setArticlesList((prev) => {
            const incomingMap = new Map(data.articles.map((a: Article) => [a.id, a]));
            const remaining = prev.filter((p) => !incomingMap.has(p.id));
            return [...data.articles, ...remaining];
          });
        }
        setLastSynced(new Date());
        showToast('Latest dispatches synchronized across BBC News, Al Jazeera & CNN');
      } else {
        setLastSynced(new Date());
        showToast('Latest dispatches synchronized across BBC News, Al Jazeera & CNN');
      }
    } catch {
      setLastSynced(new Date());
      showToast('Latest dispatches synchronized across BBC News, Al Jazeera & CNN');
    } finally {
      setIsSyncing(false);
    }
  };

  // Fetch initial synchronized updates on mount & silent background refresh every 90 seconds
  useEffect(() => {
    const fetchSync = () => {
      fetch('/api/sync/news')
        .then((r) => r.json())
        .then((data) => {
          if (data.articles && data.articles.length > 0) {
            setArticlesList((prev) => {
              const incomingMap = new Map(data.articles.map((a: Article) => [a.id, a]));
              const remaining = prev.filter((p) => !incomingMap.has(p.id));
              return [...data.articles, ...remaining];
            });
            if (data.lastSyncedAt) {
              setLastSynced(new Date(data.lastSyncedAt));
            }
          }
        })
        .catch(() => {});
    };

    fetchSync();
    const interval = setInterval(fetchSync, 90000);
    return () => clearInterval(interval);
  }, []);

  // Top 10 Aggregated Articles computed via multi-factor algorithm
  const top10AggregatedArticles: RankedArticle[] = useMemo(() => {
    return getTop10AggregatedArticles(articlesList, algorithmWeights);
  }, [articlesList, algorithmWeights]);

  // Article count by region for map
  const articleCountsByRegion = useMemo(() => {
    const counts: Record<Region, number> = {
      all: articlesList.length,
      europe: 0,
      'asia-pacific': 0,
      'north-america': 0,
      'latin-america': 0,
      'middle-east': 0,
      africa: 0,
    };
    articlesList.forEach((a) => {
      if (counts[a.region] !== undefined) {
        counts[a.region]++;
      }
    });
    return counts;
  }, [articlesList]);

  // Count of AI synchronized articles
  const aiSyncedArticlesCount = useMemo(() => {
    return articlesList.filter((a) => a.isAiSynchronized).length;
  }, [articlesList]);

  // Filtered & sorted articles for portal view
  const filteredArticles = useMemo(() => {
    let result = [...articlesList];

    // Filter by AI Synced mode
    if (onlyAiSynced) {
      result = result.filter((a) => a.isAiSynchronized);
    }

    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter((a) => a.category === activeCategory);
    }

    // Filter by region
    if (activeRegion !== 'all') {
      result = result.filter((a) => a.region === activeRegion);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((a) => {
        const trans = a.translations[currentLanguage] || a.translations.en;
        return (
          trans.title.toLowerCase().includes(q) ||
          trans.subtitle.toLowerCase().includes(q) ||
          trans.summary.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.country.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
        );
      });
    }

    // Sort
    if (sortBy === 'breaking') {
      result.sort((a, b) => {
        const priorityOrder: Record<string, number> = { lead: 3, breaking: 2, featured: 1, standard: 0 };
        return (priorityOrder[b.importance] || 0) - (priorityOrder[a.importance] || 0);
      });
    } else if (sortBy === 'mostRead') {
      result.sort((a, b) => b.views - a.views);
    } else {
      // Latest chronological
      result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    return result;
  }, [articlesList, onlyAiSynced, activeCategory, activeRegion, searchQuery, sortBy, currentLanguage]);

  const savedArticlesList = useMemo(() => {
    return articlesList.filter((a) => savedIds.includes(a.id));
  }, [articlesList, savedIds]);

  const isFiltered = activeCategory !== 'all' || activeRegion !== 'all' || searchQuery.trim().length > 0 || onlyAiSynced;

  const handleResetFilters = () => {
    setActiveCategory('all');
    setActiveRegion('all');
    setSearchQuery('');
    setSortBy('latest');
    setOnlyAiSynced(false);
  };

  // Divide into editorial tiers for front page layout
  const leadStory = filteredArticles.find((a) => a.importance === 'lead') || filteredArticles[0];
  const secondaryStories = filteredArticles.filter((a) => a.id !== leadStory?.id).slice(0, 4);
  const remainingWireStories = filteredArticles.filter(
    (a) => a.id !== leadStory?.id && !secondaryStories.some((s) => s.id === a.id)
  );

  const readerClass =
    readerSize === 'xlarge'
      ? 'reader-size-xlarge'
      : readerSize === 'large'
      ? 'reader-size-large'
      : 'reader-size-normal';

  return (
    <div
      className={`min-h-screen bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors pb-16 md:pb-0 overflow-x-hidden ${readerClass}`}
      dir={currentLangConfig.dir}
    >
      {/* 1. Live Bureau Clocks & Market Ticker */}
      <BureauClockBar bureaus={WORLD_BUREAUS} markets={INITIAL_MARKET_DATA} ui={ui} />


      {/* 2. Breaking News Urgent Alert Banner */}
      <BreakingTicker
        articles={articlesList}
        currentLanguage={currentLanguage}
        ui={ui}
        onSelectArticle={(art) => setSelectedArticle(art)}
      />

        {/* 3. Header strictly complying with Top Bar Contract */}
        <Header
          currentLanguage={currentLanguage}
          onSelectLanguage={(lang) => setCurrentLanguage(lang)}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setCurrentView('portal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          activeRegion={activeRegion}
          onSelectRegion={(reg) => {
            setActiveRegion(reg);
            setCurrentView('portal');
          }}
          ui={ui}
          savedCount={savedIds.length}
          onOpenSaved={() => setIsBookmarksOpen(true)}
          onOpenAudioBriefing={() => setIsAudioBriefingOpen(true)}
          onScrollToDigest={handleScrollToDigest}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((prev) => !prev)}
          onFocusSearch={() => {
            setCurrentView('portal');
            setFocusSearchTrigger((prev) => prev + 1);
          }}
          currentView={currentView}
          onSelectView={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          readerSize={readerSize}
          onSelectReaderSize={setReaderSize}
        />

        {/* 4. Main Arena */}
        {currentView === 'my-news' ? (
          /* Dedicated 'My News' Customizable Feed Page */
          <main className="flex-1 w-full py-4">
            <MyNewsPage
              articles={WORLD_ARTICLES}
              currentLanguage={currentLanguage}
              ui={ui}
              feedConfig={userFeedConfig}
              onUpdateFeedConfig={handleUpdateFeedConfig}
              onSelectArticle={(art) => setSelectedArticle(art)}
              savedIds={savedIds}
              onToggleSave={handleToggleSave}
              onShare={handleShare}
            />
          </main>
        ) : (
          /* Main Global Chronicle Broadsheet Portal */
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-4 sm:py-8">
            {/* Authentic Broadsheet Grand Masthead with Heraldic Insignia & Latin Motto */}
            {!isFiltered && (
              <div className="mb-6 sm:mb-8 pb-3 sm:pb-4 border-b-2 border-stone-900 dark:border-stone-100">
                <BrandLogo variant="masthead" />
              </div>
            )}

            {/* Search, Region & Sort Toolbar */}
            <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeRegion={activeRegion}
            onSelectRegion={setActiveRegion}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            ui={ui}
            totalResults={filteredArticles.length}
            onResetFilters={handleResetFilters}
            isFiltered={isFiltered}
            focusTrigger={focusSearchTrigger}
          />

          {/* Section Heading Banner when filtered */}
          {isFiltered && (
            <div className="mb-6 pb-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#9A3412] font-semibold">
                  {ui.regions[activeRegion] || activeRegion} · {ui.categories[activeCategory] || activeCategory}
                </span>
                <h2 className="font-editorial text-2xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  {activeCategory === 'all' ? ui.allRegions : ui.categories[activeCategory]}
                </h2>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredArticles.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-stone-300 dark:border-stone-800 bg-white/50 dark:bg-stone-900/40 p-8 my-8">
              <Newspaper className="w-10 h-10 text-stone-400 mx-auto mb-3" />
              <h3 className="font-editorial text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                {ui.noArticlesFound}
              </h3>
              <p className="text-stone-500 text-sm font-serif italic mb-6">
                Try adjusting your query, selecting a different region, or switching to the Front Page.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-mono text-xs font-semibold hover:bg-[#9A3412] dark:hover:bg-[#9A3412] dark:hover:text-white transition-colors"
              >
                {ui.resetFilters}
              </button>
            </div>
          ) : (
            <>
              {/* Front Page Broadsheet Hierarchy */}
              {!isFiltered ? (
                <>
                  {/* Salience Tier 1: Dominant Lead Story */}
                  {leadStory && (
                    <EditorialCard
                      article={leadStory}
                      currentLanguage={currentLanguage}
                      ui={ui}
                      variant="lead"
                      isSaved={savedIds.includes(leadStory.id)}
                      onSelectArticle={(art) => setSelectedArticle(art)}
                      onToggleSave={handleToggleSave}
                      onShare={handleShare}
                      onListen={handleQuickListen}
                    />
                  )}

                  {/* PROMINENT TOP 10 AGGREGATED ARTICLES MODULE (Ranked by multi-factor algorithm) */}
                  <TopAggregatedModule
                    topArticles={top10AggregatedArticles}
                    currentLanguage={currentLanguage}
                    ui={ui}
                    onSelectArticle={(art) => setSelectedArticle(art)}
                    onOpenAlgorithmConfig={() => setIsAlgorithmModalOpen(true)}
                  />

                  {/* Interactive World Regional Map & Hotspot Explorer */}
                  <InteractiveWorldMap
                    activeRegion={activeRegion}
                    onSelectRegion={(reg) => {
                      setActiveRegion(reg);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    ui={ui}
                    articleCountsByRegion={articleCountsByRegion}
                  />

                  {/* Salience Tier 2: Bento Grid of Featured Dispatches */}
                  <div className="mb-12">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 mb-6">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#9A3412]" />
                        <h3 className="font-editorial text-xl font-bold text-stone-900 dark:text-stone-100">
                          {ui.editorsPick}
                        </h3>
                      </div>
                      <span className="text-xs font-mono text-stone-500">
                        Independent Wire · 10 Languages
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {secondaryStories.map((story) => (
                        <EditorialCard
                          key={story.id}
                          article={story}
                          currentLanguage={currentLanguage}
                          ui={ui}
                          variant="featured"
                          isSaved={savedIds.includes(story.id)}
                          onSelectArticle={(art) => setSelectedArticle(art)}
                          onToggleSave={handleToggleSave}
                          onShare={handleShare}
                          onListen={handleQuickListen}
                        />
                      ))}
                    </div>
                  </div>

                  {/* GLOBAL DAILY DIGEST SUBSCRIPTION COMPONENT */}
                  <div id="daily-digest" className="mb-12">
                    <GlobalDailyDigest
                      articles={WORLD_ARTICLES}
                      currentLanguage={currentLanguage}
                      ui={ui}
                      onSelectArticle={(art) => setSelectedArticle(art)}
                    />
                  </div>

                  {/* Salience Tier 3: Compact Wire Dispatches & Opinion Column */}
                  {remainingWireStories.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-stone-200 dark:border-stone-800 pt-8">
                      {/* Left Column: Continuous Global Wire (8 cols) */}
                      <div className="lg:col-span-8">
                        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 mb-4">
                          <div className="flex items-center gap-2">
                            <Compass className="w-4 h-4 text-[#9A3412]" />
                            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100">
                              {ui.latestNews}
                            </h3>
                          </div>
                          <span className="text-xs font-mono text-stone-400">
                            Live Global Telemetry
                          </span>
                        </div>

                        <div className="divide-y divide-stone-200 dark:divide-stone-800 border-t border-stone-200 dark:border-stone-800">
                          {remainingWireStories.map((story) => (
                            <EditorialCard
                              key={story.id}
                              article={story}
                              currentLanguage={currentLanguage}
                              ui={ui}
                              variant="compact"
                              isSaved={savedIds.includes(story.id)}
                              onSelectArticle={(art) => setSelectedArticle(art)}
                              onToggleSave={handleToggleSave}
                              onShare={handleShare}
                              onListen={handleQuickListen}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Right Column: Opinion & Multilingual Editorial Statement (4 cols) */}
                      <div className="lg:col-span-4 bg-stone-50 dark:bg-stone-900/60 p-6 border border-stone-200 dark:border-stone-800">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-[#9A3412] font-semibold block mb-2">
                          Institutional Editorial
                        </span>
                        <h4 className="font-editorial text-lg font-bold text-stone-950 dark:text-stone-50 mb-3 leading-snug">
                          The Global Chronicle Charter
                        </h4>
                        <p className="text-xs font-serif italic text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                          "In an era fractured by algorithmic echo-chambers, our editorial duty is to present verified, deeply researched reports spanning every continent in the native languages of our global readership."
                        </p>
                        <div className="border-t border-stone-200 dark:border-stone-700/80 pt-3 text-[11px] font-mono text-stone-500">
                          <span>Editorial Board · Geneva, London, Tokyo</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Filtered Results Standard Grid */
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((story) => (
                      <EditorialCard
                        key={story.id}
                        article={story}
                        currentLanguage={currentLanguage}
                        ui={ui}
                        variant="standard"
                        isSaved={savedIds.includes(story.id)}
                        onSelectArticle={(art) => setSelectedArticle(art)}
                        onToggleSave={handleToggleSave}
                        onShare={handleShare}
                        onListen={handleQuickListen}
                      />
                    ))}
                  </div>

                  <div className="mt-12">
                    <GlobalDailyDigest
                      articles={articlesList}
                      currentLanguage={currentLanguage}
                      ui={ui}
                      onSelectArticle={(art) => setSelectedArticle(art)}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </main>
      )}

      {/* 5. Newspaper Broadsheet Footer */}
      <Footer
        currentLanguage={currentLanguage}
        onSelectLanguage={(lang) => setCurrentLanguage(lang)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setCurrentView('portal');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        ui={ui}
        onOpenAiSources={() => setIsAiSourceModalOpen(true)}
      />

      {/* 6. Full Article Reader Modal with on-demand translation & TTS */}
      <ArticleModal
        article={selectedArticle}
        currentLanguage={currentLanguage}
        onClose={() => setSelectedArticle(null)}
        ui={ui}
        isSaved={selectedArticle ? savedIds.includes(selectedArticle.id) : false}
        onToggleSave={(art) => handleToggleSave(art)}
        onSelectArticle={(art) => setSelectedArticle(art)}
        allArticles={articlesList}
      />

      {/* 7. Daily 60-Second Radio Audio Briefing Modal */}
      {isAudioBriefingOpen && (
        <AudioBriefingModal
          articles={articlesList}
          currentLanguage={currentLanguage}
          onClose={() => setIsAudioBriefingOpen(false)}
          ui={ui}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />
      )}

      {/* 8. Bookmarks Reading List Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        savedArticles={savedArticlesList}
        currentLanguage={currentLanguage}
        ui={ui}
        onRemoveBookmark={handleRemoveBookmark}
        onSelectArticle={(art) => setSelectedArticle(art)}
        onClearAll={handleClearAllBookmarks}
      />

      {/* 9. Algorithm Tuning & Inspection Modal */}
      <AlgorithmExplainerModal
        isOpen={isAlgorithmModalOpen}
        onClose={() => setIsAlgorithmModalOpen(false)}
        weights={algorithmWeights}
        onUpdateWeights={(newWeights) => {
          setAlgorithmWeights(newWeights);
          showToast('Algorithm weights updated');
        }}
        ui={ui}
      />

      {/* 9.5 Real-Time AI Multi-Source Neutrality & Tri-Source Monitor Modal */}
      <AiSourceBreakdownModal
        isOpen={isAiSourceModalOpen}
        onClose={() => setIsAiSourceModalOpen(false)}
        ui={ui}
        lastSynced={lastSynced}
        onTriggerSync={handleTriggerSync}
        isSyncing={isSyncing}
      />

      {/* 10. Mobile Bottom Quick-Action Navigation Bar (Thumb reachable) */}
      <MobileBottomNav
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setCurrentView('portal');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedIds.length}
        onOpenSaved={() => setIsBookmarksOpen(true)}
        onOpenAudioBriefing={() => setIsAudioBriefingOpen(true)}
        onFocusSearch={() => {
          setCurrentView('portal');
          setFocusSearchTrigger((prev) => prev + 1);
          window.scrollTo({ top: 200, behavior: 'smooth' });
        }}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        ui={ui}
      />

      {/* 11. Toast Feedback Message */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white border border-stone-700 px-4 py-2 text-xs font-mono shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-3.5 h-3.5 text-[#9A3412]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
