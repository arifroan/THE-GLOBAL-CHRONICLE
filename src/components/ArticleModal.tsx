import React, { useState, useEffect } from 'react';
import { Article, Language } from '../types/news';
import { SUPPORTED_LANGUAGES, UIStrings } from '../data/languages';
import { EditorialArt } from './EditorialArt';
import { analyzeArticleSentiment } from '../utils/sentimentAnalysis';
import {
  X,
  Volume2,
  VolumeX,
  Bookmark,
  Share2,
  Globe,
  CheckCircle2,
  Check,
  Type,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface ArticleModalProps {
  article: Article | null;
  currentLanguage: Language;
  onClose: () => void;
  ui: UIStrings;
  isSaved: boolean;
  onToggleSave: (article: Article) => void;
  onSelectArticle: (article: Article) => void;
  allArticles: Article[];
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  currentLanguage,
  onClose,
  ui,
  isSaved,
  onToggleSave,
  onSelectArticle,
  allArticles,
}) => {
  const [readingLanguage, setReadingLanguage] = useState<Language>(currentLanguage);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copied, setCopied] = useState(false);

  // Speech synthesis states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  useEffect(() => {
    if (article) {
      setReadingLanguage(currentLanguage);
      // Cancel any ongoing speech when modal or article changes
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setIsSpeechPaused(false);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article, currentLanguage]);

  if (!article) return null;

  const translation =
    article.translations[readingLanguage] ||
    article.translations[currentLanguage] ||
    article.translations.en;

  const activeLangConfig =
    SUPPORTED_LANGUAGES.find((l) => l.code === readingLanguage) || SUPPORTED_LANGUAGES[0];

  const isRTL = activeLangConfig.dir === 'rtl';

  // Sentiment Lexicon Analysis
  const sentiment = article.sentiment || analyzeArticleSentiment(article, readingLanguage);
  const sentimentType = sentiment.type;
  const sentimentScoreStr = sentiment.score > 0 ? `+${sentiment.score.toFixed(2)}` : sentiment.score.toFixed(2);
  const sentimentLabel =
    sentimentType === 'Positive'
      ? ui.sentimentLabels?.positive || 'Positive'
      : sentimentType === 'Negative'
      ? ui.sentimentLabels?.negative || 'Negative'
      : ui.sentimentLabels?.neutral || 'Neutral';

  // Speech handler using native Web Speech API
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      if (isSpeechPaused) {
        window.speechSynthesis.resume();
        setIsSpeechPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsSpeechPaused(true);
      }
      return;
    }

    // Prepare full text to read
    const fullText = [
      translation.title,
      translation.subtitle,
      ...translation.content,
    ].join('. ');

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = activeLangConfig.speechLang;
    utterance.rate = speechRate;

    // Pick appropriate voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => v.lang.startsWith(activeLangConfig.code));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsSpeechPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsSpeechPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsSpeechPaused(false);
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsSpeechPaused(false);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && (a.category === article.category || a.region === article.region))
    .slice(0, 3);

  const fontSizeClass =
    fontSize === 'xlarge'
      ? 'text-lg sm:text-xl leading-relaxed'
      : fontSize === 'large'
      ? 'text-base sm:text-lg leading-relaxed'
      : 'text-sm sm:text-base leading-relaxed';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className={`bg-white dark:bg-stone-900 border-0 sm:border border-stone-200 dark:border-stone-800 w-full max-w-4xl h-full sm:h-auto sm:max-h-[92vh] flex flex-col shadow-2xl relative ${
          isRTL ? 'text-right' : 'text-left'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Modal Top Utility Bar */}
        <div className="sticky top-0 z-20 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          {/* Section Breadcrumb & City */}
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400">
            <BrandLogo variant="emblem-only" className="w-4 h-4" />
            <span className="font-editorial font-bold text-stone-900 dark:text-stone-100 hidden sm:inline">
              THE GLOBAL CHRONICLES
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="uppercase font-semibold text-[#9A3412]">
              {ui.categories[article.category] || article.category}
            </span>
            <span>/</span>
            <span>{article.city}, {article.country}</span>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* Live Article Language Translator */}
            <div className="relative group">
              <button
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title={ui.translateArticle}
              >
                <Globe className="w-3.5 h-3.5 text-[#9A3412]" />
                <span className="hidden sm:inline">{activeLangConfig.localName}</span>
                <span className="text-[10px] uppercase font-bold text-stone-400">({readingLanguage})</span>
              </button>

              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl hidden group-hover:block z-30 py-1">
                <div className="px-3 py-1 text-[10px] uppercase tracking-wider font-mono text-stone-400 border-b border-stone-100 dark:border-stone-800">
                  {ui.translateArticle}
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setReadingLanguage(lang.code)}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                      readingLanguage === lang.code
                        ? 'bg-stone-100 dark:bg-stone-800 font-semibold text-[#9A3412]'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{lang.flag}</span>
                      <span>{lang.localName}</span>
                    </span>
                    {readingLanguage === lang.code && <Check className="w-3 h-3 text-[#9A3412]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size Adjuster */}
            <div className="hidden sm:flex items-center border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 text-xs font-mono ${
                  fontSize === 'normal'
                    ? 'bg-stone-200 dark:bg-stone-700 font-bold'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
                title="Default Font Size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 text-sm font-mono border-l border-stone-300 dark:border-stone-700 ${
                  fontSize === 'large'
                    ? 'bg-stone-200 dark:bg-stone-700 font-bold'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
                title="Large Font Size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 text-base font-mono border-l border-stone-300 dark:border-stone-700 ${
                  fontSize === 'xlarge'
                    ? 'bg-stone-200 dark:bg-stone-700 font-bold'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
                title="Broadsheet Font Size"
              >
                A++
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleSave(article)}
              className={`p-1.5 border transition-colors ${
                isSaved
                  ? 'bg-[#9A3412] text-white border-[#7C2D12]'
                  : 'border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
              title={isSaved ? ui.saved : ui.saveArticle}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-1.5 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
              title={ui.share}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 transition-colors ml-1"
              title={ui.close}
              aria-label={ui.close}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audio Player Ribbon if Speech active */}
        <div className="bg-stone-100 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSpeech}
              className="flex items-center gap-1.5 px-3 py-1 font-mono font-semibold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 transition-colors hover:bg-stone-800"
            >
              {isSpeaking ? (
                isSpeechPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Resume Audio</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>{ui.stopAudio}</span>
                  </>
                )
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{ui.listenArticle}</span>
                </>
              )}
            </button>

            {isSpeaking && (
              <button
                onClick={handleStopSpeech}
                className="p-1 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                title="Stop Audio"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            <span className="hidden md:inline font-mono text-[11px] text-stone-500">
              Voice Engine: {activeLangConfig.name} ({activeLangConfig.speechLang})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-stone-500">Speed:</span>
            {[0.9, 1.0, 1.25].map((rate) => (
              <button
                key={rate}
                onClick={() => setSpeechRate(rate)}
                className={`text-[11px] font-mono px-1.5 py-0.5 ${
                  speechRate === rate
                    ? 'bg-stone-300 dark:bg-stone-700 font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto p-4 sm:p-8 md:p-10">
          {/* Metadata Kicker (Zero-Pill) */}
          <div className="flex items-center flex-wrap gap-2 text-xs font-mono text-stone-500 dark:text-stone-400 mb-4">
            <span className="uppercase tracking-widest font-bold text-[#9A3412]">
              {article.source}
            </span>
            <span>·</span>
            <span>{article.city} Dispatch</span>
            <span>·</span>
            <span className="tabular-nums">
              {new Date(article.timestamp).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span>·</span>
            <span className="tabular-nums">{article.readTimeMinutes} {ui.minutes} {ui.readTime}</span>
            <span>·</span>
            {/* Sentiment Tag in Header */}
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-[11px] font-mono font-medium ${
                sentimentType === 'Positive'
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
                  : sentimentType === 'Negative'
                  ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60'
                  : 'text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700'
              }`}
              title={`Lexicon Polarity: ${sentimentScoreStr}`}
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
              <span className="text-[10px] opacity-75 tabular-nums">({sentimentScoreStr})</span>
            </span>
            {article.isFactChecked && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{ui.factChecked}</span>
                </span>
              </>
            )}
          </div>

          {/* Main Title */}
          <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-stone-950 dark:text-stone-50 leading-tight mb-4 text-balance">
            {translation.title}
          </h1>

          {/* Subtitle */}
          <p className="font-serif italic text-lg sm:text-xl text-stone-700 dark:text-stone-300 leading-relaxed mb-6 border-b border-stone-200 dark:border-stone-800 pb-5">
            {translation.subtitle}
          </p>

          {/* Byline Strip */}
          <div className="flex items-center justify-between mb-6 text-xs text-stone-600 dark:text-stone-400 border-b border-stone-100 dark:border-stone-800/80 pb-4">
            <div>
              <span className="font-semibold text-stone-900 dark:text-stone-200">
                By {article.author}
              </span>
              <span className="text-stone-500"> — {article.authorRole}</span>
            </div>
            <div className="font-mono text-[11px] text-stone-400">
              {article.views.toLocaleString()} {ui.views} · {article.shares.toLocaleString()} {ui.shares}
            </div>
          </div>

          {/* Sentiment Lexicon Analysis Box */}
          <div className="mb-8 p-4 bg-stone-50 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <span className="text-stone-500 dark:text-stone-400 uppercase tracking-wider text-[11px] font-semibold">
                Lexicon Tone Analysis:
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-bold border ${
                  sentimentType === 'Positive'
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800'
                    : sentimentType === 'Negative'
                    ? 'text-rose-700 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800'
                    : 'text-stone-700 dark:text-stone-300 bg-stone-200/60 dark:bg-stone-800/60 border-stone-300 dark:border-stone-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    sentimentType === 'Positive'
                      ? 'bg-emerald-500'
                      : sentimentType === 'Negative'
                      ? 'bg-rose-500'
                      : 'bg-stone-400 dark:bg-stone-500'
                  }`}
                />
                <span>{sentimentType}</span>
                <span className="opacity-80 tabular-nums">({sentimentScoreStr})</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400">
              <span>Positives: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{sentiment.positiveCount}</strong></span>
              <span>·</span>
              <span>Negatives: <strong className="text-rose-600 dark:text-rose-400 font-bold">{sentiment.negativeCount}</strong></span>
              {sentiment.highlightWords && sentiment.highlightWords.length > 0 && (
                <>
                  <span>·</span>
                  <span>
                    Lexicon Match: <strong className="italic text-stone-800 dark:text-stone-200">{sentiment.highlightWords.join(', ')}</strong>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Hero Editorial Illustration */}
          <div className="mb-8">
            <EditorialArt
              category={article.imageCategory}
              aspect="16:9"
              headline={translation.title}
              className="border border-stone-200 dark:border-stone-800 shadow-xs"
            />
          </div>

          {/* Executive Takeaways Callout */}
          {translation.keyTakeaways && translation.keyTakeaways.length > 0 && (
            <div className="mb-8 p-5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
              <h4 className="text-xs font-mono uppercase tracking-widest font-bold text-[#9A3412] mb-3">
                {ui.keyTakeaways}
              </h4>
              <ul className="space-y-2 text-sm text-stone-800 dark:text-stone-200">
                {translation.keyTakeaways.map((point, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <span className="font-mono text-xs font-bold text-stone-400 pt-0.5">
                      0{index + 1}.
                    </span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Article Prose Paragraphs */}
          <div className={`space-y-5 text-stone-800 dark:text-stone-200 font-prose max-w-prose mx-auto ${fontSizeClass}`}>
            {translation.content.map((paragraph, index) => {
              if (index === 0) {
                return (
                  <p
                    key={index}
                    className="first-letter:text-5xl first-letter:font-editorial first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-stone-950 dark:first-letter:text-white"
                  >
                    {paragraph}
                  </p>
                );
              }

              // Intersperse Pull Quote if present after paragraph 1
              if (index === 1 && translation.pullQuote) {
                return (
                  <React.Fragment key={index}>
                    <p>{paragraph}</p>
                    <blockquote className="my-8 py-5 border-t border-b border-stone-300 dark:border-stone-700 font-editorial italic text-xl sm:text-2xl text-stone-900 dark:text-stone-100 text-center leading-snug">
                      "{translation.pullQuote.quote}"
                      <footer className="text-xs font-mono font-medium not-italic text-stone-500 mt-3 tracking-wider uppercase">
                        — {translation.pullQuote.speaker}
                      </footer>
                    </blockquote>
                  </React.Fragment>
                );
              }

              return <p key={index}>{paragraph}</p>;
            })}
          </div>

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-stone-400 uppercase">Tags:</span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-1"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Related Stories */}
          {relatedArticles.length > 0 && (
            <div className="mt-10 pt-8 border-t border-stone-200 dark:border-stone-800">
              <h3 className="font-editorial text-xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                Related Global Dispatches
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedArticles.map((rel) => {
                  const relTrans = rel.translations[readingLanguage] || rel.translations.en;
                  return (
                    <div
                      key={rel.id}
                      onClick={() => onSelectArticle(rel)}
                      className="cursor-pointer border border-stone-200 dark:border-stone-800 p-4 hover:border-[#9A3412] transition-colors bg-stone-50/50 dark:bg-stone-950/50"
                    >
                      <span className="text-[10px] font-mono uppercase text-[#9A3412] font-semibold">
                        {rel.city}
                      </span>
                      <h4 className="font-editorial text-sm font-bold text-stone-900 dark:text-stone-100 mt-1 line-clamp-2">
                        {relTrans.title}
                      </h4>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
