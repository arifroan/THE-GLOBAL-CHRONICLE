import React, { useState } from 'react';
import { Language, NewsCategory } from '../types/news';
import { SUPPORTED_LANGUAGES, UIStrings } from '../data/languages';
import { Globe, Mail, Check, ShieldCheck } from 'lucide-react';

interface FooterProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onSelectCategory: (cat: NewsCategory) => void;
  ui: UIStrings;
}

export const Footer: React.FC<FooterProps> = ({
  currentLanguage,
  onSelectLanguage,
  onSelectCategory,
  ui,
}) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 transition-colors mt-16 font-sans">
      {/* Newsletter Section */}
      <div className="border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-mono uppercase tracking-widest text-[#9A3412] font-semibold">
                Global Briefing
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white mt-1">
                {ui.newsletterTitle}
              </h3>
              <p className="text-stone-400 text-sm mt-2 font-serif italic max-w-xl">
                {ui.newsletterSubtitle}
              </p>
            </div>

            <div className="lg:col-span-5">
              {isSubscribed ? (
                <div className="p-3 bg-stone-800 border border-stone-700 text-emerald-400 text-sm flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{ui.subscribedSuccess}</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={ui.newsletterPlaceholder}
                    required
                    className="flex-1 bg-stone-950 border border-stone-700 px-3.5 py-2.5 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-[#9A3412]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#9A3412] hover:bg-[#B45309] text-white font-mono font-medium text-xs whitespace-nowrap transition-colors"
                  >
                    {ui.subscribe}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Masthead Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 text-xs">
          {/* Brand Col */}
          <div className="col-span-2">
            <span className="font-editorial text-xl font-bold text-white block mb-2">
              {ui.brandTitle}
            </span>
            <p className="text-stone-400 leading-relaxed max-w-sm font-serif italic mb-4">
              {ui.brandTagline}
            </p>
            <div className="flex items-center gap-2 text-stone-500 font-mono text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Independent Global Trust Standard</span>
            </div>
          </div>

          {/* Categories col 1 */}
          <div>
            <h5 className="font-mono uppercase tracking-wider text-white font-semibold mb-3">
              Editorial Sections
            </h5>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onSelectCategory('world')}
                  className="hover:text-white transition-colors"
                >
                  {ui.categories.world}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('politics')}
                  className="hover:text-white transition-colors"
                >
                  {ui.categories.politics}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('business')}
                  className="hover:text-white transition-colors"
                >
                  {ui.categories.business}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('tech')}
                  className="hover:text-white transition-colors"
                >
                  {ui.categories.tech}
                </button>
              </li>
            </ul>
          </div>

          {/* Categories col 2 */}
          <div>
            <h5 className="font-mono uppercase tracking-wider text-white font-semibold mb-3">
              Specialized Wire
            </h5>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onSelectCategory('science')}
                  className="hover:text-white transition-colors"
                >
                  {ui.categories.science}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('climate')}
                  className="hover:text-white transition-colors"
                >
                  {ui.categories.climate}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('culture')}
                  className="hover:text-white transition-colors"
                >
                  {ui.categories.culture}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('health')}
                  className="hover:text-white transition-colors"
                >
                  {ui.categories.health}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('opinion')}
                  className="hover:text-white transition-colors"
                >
                  {ui.categories.opinion}
                </button>
              </li>
            </ul>
          </div>

          {/* Global Languages Quick Selector */}
          <div className="col-span-2">
            <h5 className="font-mono uppercase tracking-wider text-white font-semibold mb-3 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#9A3412]" />
              <span>International Editions (10 Languages)</span>
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onSelectLanguage(lang.code)}
                  className={`text-left p-1.5 border transition-colors flex items-center justify-between ${
                    currentLanguage === lang.code
                      ? 'bg-stone-800 border-[#9A3412] text-white font-semibold'
                      : 'border-stone-800 text-stone-400 hover:text-white hover:border-stone-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{lang.flag}</span>
                    <span>{lang.localName}</span>
                  </span>
                  <span className="font-mono text-[10px] text-stone-500 uppercase">{lang.code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-stone-500 gap-3">
          <div>
            © {new Date().getFullYear()} THE GLOBAL CHRONICLES Media Foundation. All International Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-300 cursor-pointer">Editorial Code & Standards</span>
            <span>·</span>
            <span className="hover:text-stone-300 cursor-pointer">Fact-Checking Transparency</span>
            <span>·</span>
            <span className="hover:text-stone-300 cursor-pointer">Data Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
