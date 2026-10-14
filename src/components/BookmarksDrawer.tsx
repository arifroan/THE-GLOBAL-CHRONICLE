import React from 'react';
import { Article, Language } from '../types/news';
import { UIStrings } from '../data/languages';
import { X, Trash2, Clock, ExternalLink } from 'lucide-react';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: Article[];
  currentLanguage: Language;
  ui: UIStrings;
  onRemoveBookmark: (articleId: string) => void;
  onSelectArticle: (article: Article) => void;
  onClearAll: () => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  savedArticles,
  currentLanguage,
  ui,
  onRemoveBookmark,
  onSelectArticle,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const totalMinutes = savedArticles.reduce((acc, a) => acc + a.readTimeMinutes, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block">
              Personal Archive
            </span>
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100">
              {ui.savedArticles} ({savedArticles.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Strip */}
        {savedArticles.length > 0 && (
          <div className="px-5 py-2.5 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 font-mono">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Est. {totalMinutes} min reading total</span>
            </span>
            <button
              onClick={onClearAll}
              className="text-[#9A3412] hover:underline flex items-center gap-1 text-[11px]"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear List</span>
            </button>
          </div>
        )}

        {/* Article list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {savedArticles.length === 0 ? (
            <div className="py-16 text-center text-stone-400 text-sm font-serif italic">
              {ui.noSavedArticles}
            </div>
          ) : (
            savedArticles.map((article) => {
              const translation =
                article.translations[currentLanguage] || article.translations.en;
              return (
                <div
                  key={article.id}
                  className="p-4 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-colors bg-stone-50/50 dark:bg-stone-950/40 relative group"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 mb-1.5">
                    <span className="text-[#9A3412] uppercase font-bold">
                      {article.city} · {ui.categories[article.category] || article.category}
                    </span>
                    <span>{article.readTimeMinutes} {ui.minutes}</span>
                  </div>

                  <h4
                    onClick={() => {
                      onSelectArticle(article);
                      onClose();
                    }}
                    className="font-editorial text-sm font-bold text-stone-900 dark:text-stone-100 hover:text-[#9A3412] cursor-pointer line-clamp-2 mb-2 leading-snug"
                  >
                    {translation.title}
                  </h4>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                    <span className="text-stone-400 font-mono text-[11px]">
                      {article.source}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectArticle(article);
                          onClose();
                        }}
                        className="text-[#9A3412] hover:underline flex items-center gap-1 text-[11px] font-mono"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onRemoveBookmark(article.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
