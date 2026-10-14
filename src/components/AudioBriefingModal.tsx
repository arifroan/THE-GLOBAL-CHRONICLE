import React, { useState, useEffect } from 'react';
import { Article, Language } from '../types/news';
import { SUPPORTED_LANGUAGES, UIStrings } from '../data/languages';
import { X, Play, Pause, SkipForward, SkipBack, Radio, Volume2 } from 'lucide-react';

interface AudioBriefingModalProps {
  articles: Article[];
  currentLanguage: Language;
  onClose: () => void;
  ui: UIStrings;
  onSelectArticle: (article: Article) => void;
}

export const AudioBriefingModal: React.FC<AudioBriefingModalProps> = ({
  articles,
  currentLanguage,
  onClose,
  ui,
  onSelectArticle,
}) => {
  const topStories = articles.slice(0, 3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  const activeLangConfig =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const currentArticle = topStories[currentIndex];
  const translation = currentArticle
    ? currentArticle.translations[currentLanguage] || currentArticle.translations.en
    : null;

  const speakCurrentStory = () => {
    if (!('speechSynthesis' in window) || !currentArticle || !translation) return;

    window.speechSynthesis.cancel();

    const script = `Dispatch ${currentIndex + 1} of ${topStories.length}. From ${currentArticle.city}, ${currentArticle.country}. ${translation.title}. ${translation.summary}`;

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.lang = activeLangConfig.speechLang;
    utterance.rate = playbackRate;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.startsWith(activeLangConfig.code));
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      if (currentIndex < topStories.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    };

    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      speakCurrentStory();
    }
  }, [currentIndex, playbackRate]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTogglePlay = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      speakCurrentStory();
    }
  };

  const handleNext = () => {
    if (currentIndex < topStories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-stone-900 border border-stone-800 text-stone-100 w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-8 relative">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#9A3412] animate-pulse" />
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 block">
                THE GLOBAL CHRONICLES RADIO
              </span>
              <h3 className="font-editorial text-lg font-bold text-white">
                {ui.audioBriefingTitle}
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-1.5 text-stone-400 hover:text-white border border-stone-700 hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Waveform */}
        <div className="h-16 bg-stone-950 border border-stone-800 flex items-center justify-center gap-1.5 px-4 mb-6">
          {[40, 65, 30, 85, 95, 45, 70, 80, 50, 90, 60, 75, 35, 80, 65, 50, 70, 45].map(
            (height, i) => (
              <div
                key={i}
                style={{
                  height: isPlaying ? `${Math.max(15, (height * (i % 3 === 0 ? 1 : 0.8)))}%` : '15%',
                  transition: 'height 0.15s ease-in-out',
                }}
                className={`w-1 rounded-full ${
                  isPlaying ? 'bg-[#9A3412]' : 'bg-stone-700'
                }`}
              />
            )
          )}
        </div>

        {/* Current Dispatch Metadata */}
        {currentArticle && translation && (
          <div className="mb-6 p-4 bg-stone-950 border border-stone-800">
            <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-2">
              <span className="text-[#9A3412] uppercase font-bold">
                Story {currentIndex + 1} of {topStories.length} · {currentArticle.city}
              </span>
              <span>{activeLangConfig.localName}</span>
            </div>
            <h4 className="font-editorial text-base sm:text-lg font-bold text-white mb-2 leading-snug">
              {translation.title}
            </h4>
            <p className="text-xs text-stone-300 font-sans leading-relaxed line-clamp-3">
              {translation.summary}
            </p>
          </div>
        )}

        {/* Player Controls */}
        <div className="flex items-center justify-between gap-4 pt-2">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 text-xs font-mono">
            {[0.85, 1.0, 1.25].map((rate) => (
              <button
                key={rate}
                onClick={() => setPlaybackRate(rate)}
                className={`px-2 py-1 border border-stone-800 ${
                  playbackRate === rate
                    ? 'bg-stone-800 text-white font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Central playback controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 border border-stone-800 hover:bg-stone-800 text-stone-300 disabled:opacity-30 disabled:hover:bg-transparent"
              title="Previous Story"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="px-5 py-2 bg-[#9A3412] hover:bg-[#B45309] text-white font-mono font-bold text-xs flex items-center gap-2 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Briefing</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Briefing</span>
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === topStories.length - 1}
              className="p-2 border border-stone-800 hover:bg-stone-800 text-stone-300 disabled:opacity-30 disabled:hover:bg-transparent"
              title="Next Story"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Direct jump to story */}
          {currentArticle && (
            <button
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                onClose();
                onSelectArticle(currentArticle);
              }}
              className="text-xs font-mono text-[#9A3412] hover:underline hidden sm:inline"
            >
              Read Full →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
