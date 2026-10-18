import React from 'react';
import { RankedArticle, Language } from '../types/news';
import { UIStrings } from '../data/languages';
import { SlidersHorizontal, CheckCircle2, TrendingUp, Clock, ShieldCheck, ChevronRight } from 'lucide-react';

interface TopAggregatedModuleProps {
  topArticles: RankedArticle[];
  currentLanguage: Language;
  ui: UIStrings;
  onSelectArticle: (article: RankedArticle) => void;
  onOpenAlgorithmConfig: () => void;
}

export const TopAggregatedModule: React.FC<TopAggregatedModuleProps> = ({
  topArticles,
  currentLanguage,
  ui,
  onSelectArticle,
  onOpenAlgorithmConfig,
}) => {
  return (
    <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-8 mb-10 transition-colors shadow-xs">
      {/* Module Title Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-stone-200 dark:border-stone-800 mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#9A3412] uppercase tracking-widest font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{ui.aggregationAlgorithm}</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-950 dark:text-stone-50 mt-1">
            {ui.top10Aggregated}
          </h2>
          <p className="text-xs font-serif italic text-stone-500 dark:text-stone-400 mt-1">
            Real-time multi-source composite scoring across wire tier credibility, recency half-life, and global reader engagement.
          </p>
        </div>

        {/* Algorithm Weights & Inspector Button */}
        <button
          onClick={onOpenAlgorithmConfig}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-medium border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 transition-colors whitespace-nowrap self-start sm:self-center"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#9A3412]" />
          <span>{ui.configureAlgorithm}</span>
        </button>
      </div>

      {/* Grid of 10 items in 2 balanced columns (5 per column) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 divide-y lg:divide-y-0 divide-stone-100 dark:divide-stone-800">
        {topArticles.map((article, idx) => {
          const translation = article.translations[currentLanguage] || article.translations.en;
          const ranking = article.ranking;
          const rankNum = idx + 1;
          const isTopThree = rankNum <= 3;
          const sentiment = article.sentiment;
          const sentimentType = sentiment?.type || 'Neutral';
          const sentimentLabel =
            sentimentType === 'Positive'
              ? ui.sentimentLabels?.positive || 'Positive'
              : sentimentType === 'Negative'
              ? ui.sentimentLabels?.negative || 'Negative'
              : ui.sentimentLabels?.neutral || 'Neutral';

          return (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group cursor-pointer py-3.5 px-2 hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors flex items-start gap-4 border-b border-stone-100 dark:border-stone-800/60"
            >
              {/* Ordinal Rank Number */}
              <div
                className={`font-editorial font-bold text-2xl sm:text-3xl leading-none w-8 text-right shrink-0 pt-0.5 ${
                  isTopThree
                    ? 'text-[#9A3412]'
                    : 'text-stone-300 dark:text-stone-600'
                }`}
              >
                {rankNum < 10 ? `0${rankNum}` : rankNum}
              </div>

              {/* Main Content Area */}
              <div className="flex-1 min-w-0">
                {/* Unboxed Metadata with · separator (Zero-Pill discipline) */}
                <div className="flex items-center flex-wrap gap-2 text-[11px] font-mono text-stone-500 dark:text-stone-400 mb-1">
                  <span className="font-semibold text-stone-900 dark:text-stone-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{article.source}</span>
                  </span>
                  <span>·</span>
                  <span className="text-[#9A3412] uppercase font-medium">
                    {ui.categories[article.category] || article.category}
                  </span>
                  <span>·</span>
                  <span className="tabular-nums">
                    {ranking.hoursAgo < 1
                      ? `${Math.max(1, Math.round(ranking.hoursAgo * 60))}m ago`
                      : `${ranking.hoursAgo}h ago`}
                  </span>
                  <span>·</span>
                  <span className="text-stone-400 font-mono">
                    Score: <strong className="text-stone-900 dark:text-stone-100 font-bold">{ranking.totalScore}</strong>/100
                  </span>
                  <span>·</span>
                  {/* Sentiment Tag */}
                  <span
                    className={`inline-flex items-center gap-1 text-[10.5px] font-mono font-medium ${
                      sentimentType === 'Positive'
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : sentimentType === 'Negative'
                        ? 'text-rose-700 dark:text-rose-400'
                        : 'text-stone-500 dark:text-stone-400'
                    }`}
                    title={`Lexicon Sentiment: ${sentimentType}${sentiment ? ` (${sentiment.score > 0 ? `+${sentiment.score.toFixed(2)}` : sentiment.score.toFixed(2)})` : ''}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        sentimentType === 'Positive'
                          ? 'bg-emerald-500'
                          : sentimentType === 'Negative'
                          ? 'bg-rose-500'
                          : 'bg-stone-400 dark:bg-stone-500'
                      }`}
                    />
                    <span>{sentimentLabel}</span>
                  </span>
                </div>

                {/* Article Headline */}
                <h4 className="font-editorial text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-[#9A3412] transition-colors leading-snug line-clamp-2 mb-1.5">
                  {translation.title}
                </h4>

                {/* Score Breakdown Bar */}
                <div className="flex items-center gap-3 text-[10px] font-mono text-stone-400">
                  <span title="Recency Velocity Score" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Recency: {ranking.recencyScore}</span>
                  </span>
                  <span>|</span>
                  <span title="Source Credibility Authority" className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Authority: {ranking.authorityScore}</span>
                  </span>
                  <span>|</span>
                  <span title="User Engagement (Views + Shares)" className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Engagement: {ranking.engagementScore}</span>
                  </span>
                </div>
              </div>

              {/* Read Action arrow */}
              <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity text-[#9A3412]">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
