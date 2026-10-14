import React, { useState, useEffect } from 'react';
import { Article, Language, DigestSubscription } from '../types/news';
import { SUPPORTED_LANGUAGES, UIStrings } from '../data/languages';
import {
  Mail,
  CheckCircle2,
  Clock,
  Globe,
  Eye,
  EyeOff,
  Settings,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  BookmarkCheck,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface GlobalDailyDigestProps {
  articles: Article[];
  currentLanguage: Language;
  ui: UIStrings;
  onSelectArticle?: (article: Article) => void;
  className?: string;
}

const STORAGE_KEY = 'global_chronicles_daily_digest_sub';

export const GlobalDailyDigest: React.FC<GlobalDailyDigestProps> = ({
  articles,
  currentLanguage,
  ui,
  onSelectArticle,
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'morning' | 'evening' | 'both'>('morning');
  const [digestLanguage, setDigestLanguage] = useState<Language>(currentLanguage);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'world',
    'politics',
    'business',
    'tech',
  ]);
  const [subscription, setSubscription] = useState<DigestSubscription | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync with current language on mount if not customized
  useEffect(() => {
    setDigestLanguage(currentLanguage);
  }, [currentLanguage]);

  // Load existing subscription from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: DigestSubscription = JSON.parse(saved);
        setSubscription(parsed);
        setEmail(parsed.email);
        setFrequency(parsed.frequency);
        setDigestLanguage(parsed.language);
        if (parsed.topics) setSelectedTopics(parsed.topics);
      }
    } catch {
      // ignore
    }
  }, []);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    const subData: DigestSubscription = {
      email: trimmedEmail,
      frequency,
      topics: selectedTopics,
      language: digestLanguage,
      subscribedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(subData));
    setSubscription(subData);
    setIsEditing(false);
    showNotification(`Subscribed to Global Daily Digest (${trimmedEmail})`);
  };

  const handleUnsubscribe = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSubscription(null);
    setEmail('');
    setIsEditing(false);
    showNotification('You have opted out of the Global Daily Digest.');
  };

  const toggleTopic = (topicKey: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicKey)
        ? prev.length > 1
          ? prev.filter((t) => t !== topicKey)
          : prev
        : [...prev, topicKey]
    );
  };

  // Prepare top 3 articles for preview
  const previewArticles = articles
    .filter((a) => selectedTopics.includes(a.category) || selectedTopics.includes('world'))
    .slice(0, 3);

  const digestLangConfig =
    SUPPORTED_LANGUAGES.find((l) => l.code === digestLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <section
      aria-label="Global Daily Digest Subscription"
      className={`bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 border-t-4 border-t-[#9A3412] p-6 sm:p-8 transition-colors shadow-xs ${className}`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950 px-4 py-2.5 font-mono text-xs border border-stone-700 dark:border-stone-300 shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Strip */}
      <div className="flex flex-col md:flex-row md:items-start justify-between pb-6 border-b border-stone-100 dark:border-stone-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#9A3412] uppercase tracking-widest font-bold">
            <Mail className="w-3.5 h-3.5" />
            <span>Editorial Intelligence Dispatch</span>
          </div>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-950 dark:text-stone-50 mt-1">
            Global Daily Digest
          </h3>
          <p className="text-sm font-serif italic text-stone-600 dark:text-stone-300 mt-1.5 max-w-2xl leading-relaxed">
            A curated 5-minute morning intelligence briefing delivered directly to your inbox. Essential geopolitical, economic, and technological developments synthesized by our bureaus across 6 continents.
          </p>
        </div>

        {/* Action button: Sample Preview Toggle */}
        <div className="flex items-center gap-2 self-start shrink-0">
          <button
            type="button"
            onClick={() => setIsPreviewOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
          >
            {isPreviewOpen ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-[#9A3412]" />
                <span>Hide Sample Digest</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-[#9A3412]" />
                <span>Preview Sample Digest</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Area: Subscribed State vs Opt-In Form */}
      {subscription && !isEditing ? (
        /* SUBSCRIBED / OPTED-IN STATE */
        <div className="pt-6">
          <div className="bg-[#FAF7EE] dark:bg-stone-950/80 border border-[#E7DECD] dark:border-stone-800 p-5 sm:p-6 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
                  <BookmarkCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-400 font-semibold">
                      Subscription Active
                    </span>
                    <span className="text-stone-400">·</span>
                    <span className="font-mono text-xs text-stone-500 capitalize">
                      {subscription.frequency === 'both'
                        ? 'Morning & Evening Editions'
                        : `${subscription.frequency} Edition`}
                    </span>
                  </div>
                  <h4 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {subscription.email}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-stone-500 mt-1.5">
                    <span>Edition: {digestLangConfig.name} ({digestLangConfig.flag})</span>
                    <span>·</span>
                    <span>
                      Delivery:{' '}
                      {subscription.frequency === 'morning'
                        ? '06:00 UTC'
                        : subscription.frequency === 'evening'
                        ? '18:00 UTC'
                        : '06:00 & 18:00 UTC'}
                    </span>
                    <span>·</span>
                    <span>Topics: {subscription.topics.length} Selected</span>
                  </div>
                </div>
              </div>

              {/* Preferences / Opt-out buttons */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-mono font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5 text-stone-700 dark:text-stone-300"
                >
                  <Settings className="w-3.5 h-3.5 text-stone-500" />
                  <span>Edit Preferences</span>
                </button>
                <button
                  type="button"
                  onClick={handleUnsubscribe}
                  className="px-3 py-1.5 border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-stone-900 text-xs font-mono font-medium text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  Opt Out
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* OPT-IN SUBSCRIPTION FORM */
        <form onSubmit={handleSubscribe} className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Columns: Email input and frequency preference */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label
                  htmlFor="digest-email"
                  className="block font-mono text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300 font-semibold mb-1.5"
                >
                  Recipient Email Address <span className="text-[#9A3412]">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="digest-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      placeholder="e.g. correspondent@newsroom.org"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 font-sans text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-[#9A3412] focus:ring-1 focus:ring-[#9A3412] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#9A3412] hover:bg-[#7C2D12] text-white font-mono text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 shrink-0 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{subscription ? 'Update Opt-In' : 'Opt Into Digest'}</span>
                  </button>
                </div>
                {errorMsg && (
                  <p className="font-mono text-xs text-rose-600 dark:text-rose-400 mt-1">
                    {errorMsg}
                  </p>
                )}
              </div>

              {/* Delivery Frequency Option */}
              <div>
                <span className="block font-mono text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300 font-semibold mb-1.5">
                  Delivery Frequency & Edition
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'morning', label: 'Morning Dispatch', time: '06:00 UTC' },
                    { id: 'evening', label: 'Evening Wrap', time: '18:00 UTC' },
                    { id: 'both', label: 'Both Editions', time: '06:00 & 18:00 UTC' },
                  ].map((freq) => (
                    <button
                      key={freq.id}
                      type="button"
                      onClick={() => setFrequency(freq.id as any)}
                      className={`text-left p-2.5 border transition-colors ${
                        frequency === freq.id
                          ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900 dark:border-stone-100'
                          : 'bg-stone-50 dark:bg-stone-950 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-stone-400'
                      }`}
                    >
                      <div className="font-editorial text-xs font-bold leading-tight">{freq.label}</div>
                      <div className="font-mono text-[10px] opacity-75 mt-0.5">{freq.time}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Edition Language */}
              <div>
                <span className="block font-mono text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300 font-semibold mb-1.5">
                  Digest Language Edition
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setDigestLanguage(lang.code)}
                      className={`px-2.5 py-1 text-xs font-mono border transition-colors flex items-center gap-1.5 ${
                        digestLanguage === lang.code
                          ? 'border-[#9A3412] bg-[#9A3412]/10 text-[#9A3412] font-bold'
                          : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.localName}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Topic Focus & Privacy Statement */}
            <div className="lg:col-span-5 bg-stone-50 dark:bg-stone-950/60 p-5 border border-stone-200 dark:border-stone-800 space-y-4">
              <div>
                <span className="block font-mono text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300 font-semibold mb-2">
                  Topic Focus Areas
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                  {[
                    { id: 'world', label: 'World Affairs' },
                    { id: 'politics', label: 'Politics & Diplomacy' },
                    { id: 'business', label: 'Markets & Economy' },
                    { id: 'tech', label: 'Technology & AI' },
                    { id: 'climate', label: 'Climate & Energy' },
                    { id: 'science', label: 'Science & Cosmos' },
                    { id: 'sports', label: 'Global Sports' },
                    { id: 'entertainment', label: 'Entertainment' },
                  ].map((topic) => {
                    const isSelected = selectedTopics.includes(topic.id);
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => toggleTopic(topic.id)}
                        className={`text-left px-2.5 py-1.5 border transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-white dark:bg-stone-900 border-[#9A3412] text-stone-900 dark:text-stone-100 font-medium'
                            : 'bg-transparent border-stone-200 dark:border-stone-800 text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        <span className="truncate">{topic.label}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#9A3412] shrink-0 ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Privacy and Verification Assurance */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 text-[11px] font-mono text-stone-500 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  No advertisements or commercial trackers. Your email is used exclusively to dispatch editorial digests. One-click opt-out anytime.
                </span>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-xs font-mono text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline"
                  >
                    Cancel Editing
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      )}

      {/* SAMPLE DIGEST PREVIEW DRAWER */}
      {isPreviewOpen && (
        <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800 bg-[#FAF7EE] dark:bg-stone-950 p-6 border border-[#E8DEC8] dark:border-stone-800 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-stone-300 dark:border-stone-800 mb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-stone-600 dark:text-stone-400">
              <Sparkles className="w-3.5 h-3.5 text-[#9A3412]" />
              <span className="uppercase tracking-wider font-semibold">
                Simulated Email Preview: {digestLangConfig.name} Edition
              </span>
            </div>
            <span className="text-[11px] font-mono text-stone-400">
              Dispatched at 06:00 UTC · 5 Min Read
            </span>
          </div>

          {/* Email Newsletter Container */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 max-w-3xl mx-auto shadow-sm">
            {/* Newsletter Masthead */}
            <div className="flex flex-col items-center text-center pb-4 border-b-2 border-stone-900 dark:border-stone-100 mb-6">
              <BrandLogo variant="digest" className="mb-2" />
              <div className="text-xs font-mono text-stone-400 mt-1">
                {new Intl.DateTimeFormat(digestLangConfig.speechLang, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }).format(new Date())}{' '}
                · Geneva, London, Tokyo, New York
              </div>
            </div>

            {/* Stories inside preview */}
            <div className="space-y-6 divide-y divide-stone-100 dark:divide-stone-800">
              {previewArticles.map((art, index) => {
                const trans = art.translations[digestLanguage] || art.translations.en;
                return (
                  <div key={art.id} className={index > 0 ? 'pt-4' : ''}>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 mb-1">
                      <span className="font-bold text-[#9A3412]">0{index + 1}.</span>
                      <span className="uppercase font-semibold">{art.source}</span>
                      <span>·</span>
                      <span>{art.city}</span>
                      <span>·</span>
                      <span className="tabular-nums">{art.readTimeMinutes} min read</span>
                    </div>

                    <h4
                      onClick={() => onSelectArticle && onSelectArticle(art)}
                      className="font-editorial text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug cursor-pointer hover:text-[#9A3412] transition-colors mb-1.5"
                    >
                      {trans.title}
                    </h4>

                    <p className="font-prose text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-2.5">
                      {trans.summary}
                    </p>

                    {trans.keyTakeaways && trans.keyTakeaways.length > 0 && (
                      <div className="bg-stone-50 dark:bg-stone-950 p-2.5 border border-stone-200/60 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 font-sans">
                        <span className="font-mono text-[10px] uppercase font-bold text-stone-400 block mb-1">
                          Key Synthesis:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                          {trans.keyTakeaways.slice(0, 2).map((takeaway, k) => (
                            <li key={k} className="leading-tight">{takeaway}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Newsletter footer note */}
            <div className="mt-8 pt-4 border-t border-stone-200 dark:border-stone-800 text-center text-[10px] font-mono text-stone-400">
              <span>You opted into this dispatch via THE GLOBAL CHRONICLES portal.</span>
              <span className="mx-2">·</span>
              <span className="underline cursor-pointer" onClick={handleUnsubscribe}>
                One-Click Unsubscribe
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
