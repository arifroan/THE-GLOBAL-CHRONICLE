import React from 'react';
import { Article, Language } from '../types/news';
import { UIStrings } from '../data/languages';
import { EditorialArt } from './EditorialArt';
import { Bookmark, Share2, Volume2, CheckCircle2 } from 'lucide-react';

interface EditorialCardProps {
  article: Article;
  currentLanguage: Language;
  ui: UIStrings;
  variant?: 'lead' | 'featured' | 'compact' | 'standard';
  isSaved?: boolean;
  onSelectArticle: (article: Article) => void;
  onToggleSave?: (article: Article, e: React.MouseEvent) => void;
  onShare?: (article: Article, e: React.MouseEvent) => void;
  onListen?: (article: Article, e: React.MouseEvent) => void;
}

export const EditorialCard: React.FC<EditorialCardProps> = ({
  article,
  currentLanguage,
  ui,
  variant = 'standard',
  isSaved = false,
  onSelectArticle,
  onToggleSave,
  onShare,
  onListen,
}) => {
  const translation = article.translations[currentLanguage] || article.translations.en;
  const categoryLabel = ui.categories[article.category] || article.category;
  const regionLabel = ui.regions[article.region] || article.region;

  // Format relative timestamp
  const dateFormatted = new Date(article.timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  if (variant === 'lead') {
    return (
      <article
        onClick={() => onSelectArticle(article)}
        className="group cursor-pointer bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 lg:p-8 transition-shadow hover:shadow-md mb-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Editorial Text (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full">
            <div>
              {/* Quiet unboxed text metadata with · separators (Strict Zero-Pill) */}
              <div className="flex items-center flex-wrap gap-2 text-xs font-mono text-stone-500 dark:text-stone-400 mb-3">
                <span className="uppercase tracking-wider font-semibold text-[#9A3412]">
                  {categoryLabel}
                </span>
                <span aria-hidden="true">·</span>
                <span>{regionLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{article.city}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{dateFormatted}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{article.readTimeMinutes} {ui.minutes}</span>
                {article.isFactChecked && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{ui.factChecked}</span>
                    </span>
                  </>
                )}
              </div>

              {/* Lead Headline with balance wrap */}
              <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-950 dark:text-stone-50 leading-tight mb-4 group-hover:text-[#9A3412] transition-colors text-balance">
                {translation.title}
              </h2>

              {/* Subtitle / Deck */}
              <p className="text-base sm:text-lg font-serif italic text-stone-700 dark:text-stone-300 mb-4 leading-relaxed">
                {translation.subtitle}
              </p>

              {/* Lead Excerpt with Drop Cap */}
              <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base leading-relaxed mb-5 font-prose first-letter:text-4xl first-letter:font-editorial first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-stone-950 dark:first-letter:text-white first-letter:leading-none">
                {translation.summary}
              </p>

              {/* Executive Takeaways */}
              {translation.keyTakeaways && translation.keyTakeaways.length > 0 && (
                <div className="bg-stone-50 dark:bg-stone-950/70 p-4 border border-stone-200/80 dark:border-stone-800 mb-5">
                  <span className="text-[11px] uppercase tracking-wider font-mono font-semibold text-stone-500 dark:text-stone-400 block mb-2">
                    {ui.keyTakeaways}
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300 font-sans">
                    {translation.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#9A3412] font-mono font-bold">0{idx + 1}.</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bylines and actions */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-stone-600 dark:text-stone-400 font-sans">
                <span className="font-semibold text-stone-900 dark:text-stone-200">
                  {article.author}
                </span>
                <span className="text-stone-400"> — {article.authorRole}</span>
                <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                  {article.source}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {onListen && (
                  <button
                    onClick={(e) => onListen(article, e)}
                    className="p-2 text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    title={ui.listenArticle}
                    aria-label={ui.listenArticle}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
                {onToggleSave && (
                  <button
                    onClick={(e) => onToggleSave(article, e)}
                    className={`p-2 border transition-colors ${
                      isSaved
                        ? 'bg-[#9A3412] text-white border-[#7C2D12]'
                        : 'text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                    title={isSaved ? ui.saved : ui.saveArticle}
                    aria-label="Save"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                )}
                {onShare && (
                  <button
                    onClick={(e) => onShare(article, e)}
                    className="p-2 text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    title={ui.share}
                    aria-label="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                )}
                <span className="text-xs font-semibold text-[#9A3412] hover:underline font-mono ml-2">
                  {ui.readDispatch} →
                </span>
              </div>
            </div>
          </div>

          {/* Right Lead Visual Slot (5 cols on lg) */}
          <div className="lg:col-span-5 h-full flex flex-col justify-between">
            <EditorialArt
              category={article.imageCategory}
              aspect="4:3"
              className="border border-stone-200 dark:border-stone-800 shadow-xs"
            />
            {/* Pull Quote Box */}
            {translation.pullQuote && (
              <blockquote className="mt-4 p-5 bg-stone-50 dark:bg-stone-950/80 border-t border-b border-stone-200 dark:border-stone-800 font-serif italic text-sm text-stone-800 dark:text-stone-300 leading-relaxed">
                "{translation.pullQuote.quote}"
                <cite className="block not-italic text-xs font-mono text-stone-500 mt-2">
                  — {translation.pullQuote.speaker}
                </cite>
              </blockquote>
            )}
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article
        onClick={() => onSelectArticle(article)}
        className="group cursor-pointer py-3 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between gap-4 transition-colors hover:bg-stone-50/70 dark:hover:bg-stone-800/40 px-2"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 dark:text-stone-400 mb-1">
            <span className="text-[#9A3412] uppercase font-semibold">{categoryLabel}</span>
            <span>·</span>
            <span>{article.city}</span>
            <span>·</span>
            <span className="tabular-nums">{dateFormatted}</span>
          </div>
          <h4 className="font-editorial text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-[#9A3412] transition-colors line-clamp-2">
            {translation.title}
          </h4>
        </div>
        <div className="shrink-0 text-stone-400 font-mono text-xs flex items-center gap-1.5 self-center">
          {onToggleSave && (
            <button
              onClick={(e) => onToggleSave(article, e)}
              className="p-1 hover:text-[#9A3412]"
              aria-label="Save"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-[#9A3412]' : ''}`} />
            </button>
          )}
          <span className="text-[10px] tabular-nums font-mono">{article.readTimeMinutes}m</span>
        </div>
      </article>
    );
  }

  // Standard Grid Feature Card
  return (
    <article
      onClick={() => onSelectArticle(article)}
      className="group cursor-pointer bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col justify-between transition-shadow hover:shadow-md"
    >
      <div>
        <EditorialArt
          category={article.imageCategory}
          aspect="16:9"
          className="border-b border-stone-200 dark:border-stone-800"
        />

        <div className="p-5">
          {/* Zero-Pill Unboxed Text Metadata */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs font-mono text-stone-500 dark:text-stone-400 mb-2">
            <span className="uppercase font-semibold text-[#9A3412]">{categoryLabel}</span>
            <span>·</span>
            <span>{article.city}</span>
            <span>·</span>
            <span className="tabular-nums">{dateFormatted}</span>
            <span>·</span>
            <span className="tabular-nums">{article.readTimeMinutes} {ui.minutes}</span>
          </div>

          <h3 className="font-editorial text-lg sm:text-xl font-bold text-stone-950 dark:text-stone-100 leading-snug mb-2 group-hover:text-[#9A3412] transition-colors line-clamp-3">
            {translation.title}
          </h3>

          <p className="font-prose text-sm text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3 mb-4">
            {translation.summary}
          </p>
        </div>
      </div>

      <div className="px-5 pb-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-500">
        <span className="font-sans truncate max-w-[150px] font-medium text-stone-800 dark:text-stone-300">
          {article.author}
        </span>

        <div className="flex items-center gap-2">
          {onListen && (
            <button
              onClick={(e) => onListen(article, e)}
              className="p-1 hover:text-stone-900 dark:hover:text-white"
              title={ui.listenArticle}
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
          {onToggleSave && (
            <button
              onClick={(e) => onToggleSave(article, e)}
              className="p-1 hover:text-[#9A3412]"
              title={isSaved ? ui.saved : ui.saveArticle}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-[#9A3412]' : ''}`} />
            </button>
          )}
          {onShare && (
            <button
              onClick={(e) => onShare(article, e)}
              className="p-1 hover:text-stone-900 dark:hover:text-white"
              title={ui.share}
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
