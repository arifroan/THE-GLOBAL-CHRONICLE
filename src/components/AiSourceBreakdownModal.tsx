import React, { useState } from 'react';
import { X, ShieldCheck, ExternalLink, Radio, Sparkles, CheckCircle2, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import { UIStrings } from '../data/languages';

interface AiSourceBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  ui: UIStrings;
  lastSynced: Date;
  onTriggerSync: () => Promise<void>;
  isSyncing: boolean;
}

export const AiSourceBreakdownModal: React.FC<AiSourceBreakdownModalProps> = ({
  isOpen,
  onClose,
  ui,
  lastSynced,
  onTriggerSync,
  isSyncing,
}) => {
  const [topicInput, setTopicInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateDeepDive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenError(null);
    try {
      const res = await fetch('/api/ai/deep-dive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicInput.trim() }),
      });
      const data = await res.json();
      if (data.success && data.synthesis) {
        setGeneratedResult(data.synthesis);
      } else {
        setGenError(data.error || 'Failed to synthesize report.');
      }
    } catch (err) {
      setGenError((err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Real-Time AI Multi-Source Neutrality Engine"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 dark:border-stone-800 bg-[#F5F2EB] dark:bg-stone-950">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h2 className="font-editorial text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                Real-Time AI Multi-Source Neutrality Engine
              </h2>
              <p className="text-xs font-mono text-stone-500 dark:text-stone-400">
                Continuous live synchronization with BBC News · Al Jazeera · CNN
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* Methodology Card */}
          <div className="p-4 bg-stone-50 dark:bg-stone-950/80 border border-stone-200 dark:border-stone-800">
            <h3 className="text-xs font-mono uppercase tracking-widest font-bold text-[#9A3412] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              How AI Dispatches Are Written With Zero Bias
            </h3>
            <p className="text-sm font-serif text-stone-700 dark:text-stone-300 leading-relaxed mb-3">
              To eliminate single-outlet slant, political partisanship, and sensationalism, reports in <em>The Global Chronicles</em> are continuously written and cross-referenced in real time by our AI Editorial Bureau using empirical source triangulation:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <span className="font-bold text-stone-900 dark:text-stone-100 block mb-1">01. Live Ingestion</span>
                <span className="text-stone-500 dark:text-stone-400 leading-normal block">
                  Captures breaking wire cables from London (BBC), Doha (Al Jazeera), and Atlanta (CNN) around the clock.
                </span>
              </div>
              <div className="p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <span className="font-bold text-stone-900 dark:text-stone-100 block mb-1">02. Cross-Verification</span>
                <span className="text-stone-500 dark:text-stone-400 leading-normal block">
                  Confirms intersecting facts. Diverging claims are explicitly attributed with zero editorial distortion.
                </span>
              </div>
              <div className="p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <span className="font-bold text-stone-900 dark:text-stone-100 block mb-1">03. Neutral Lexicon</span>
                <span className="text-stone-500 dark:text-stone-400 leading-normal block">
                  Purges emotive adjectives and hyperbolic spin. Produces clean, balanced journalism verified at 99%+ neutrality.
                </span>
              </div>
            </div>
          </div>

          {/* Tri-Source Live Status Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                Live Channel Feeds Monitored
              </h3>
              <span className="text-xs font-mono text-stone-500">
                Last synchronized: {lastSynced.toLocaleTimeString()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* BBC Card */}
              <div className="p-3.5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold font-editorial text-base text-stone-950 dark:text-stone-50">
                      BBC News
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      LIVE / ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-sans mb-3">
                    Public service broadcaster charter. Grounded in UK & European diplomatic reporting and verification.
                  </p>
                </div>
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] font-mono text-stone-500">
                  <span>World Wire Feed</span>
                  <a
                    href="https://www.bbc.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#9A3412] hover:underline"
                  >
                    bbc.com <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Al Jazeera Card */}
              <div className="p-3.5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold font-editorial text-base text-stone-950 dark:text-stone-50">
                      Al Jazeera
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      LIVE / ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-sans mb-3">
                    Independent Middle Eastern and Global South network. Focuses on grassroots civil society and humanitarian perspectives.
                  </p>
                </div>
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] font-mono text-stone-500">
                  <span>Global RSS Stream</span>
                  <a
                    href="https://www.aljazeera.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#9A3412] hover:underline"
                  >
                    aljazeera.com <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* CNN Card */}
              <div className="p-3.5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold font-editorial text-base text-stone-950 dark:text-stone-50">
                      CNN International
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      LIVE / ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-sans mb-3">
                    Global commercial broadcast network. Provides extensive coverage of international markets, tech, and multilateral diplomacy.
                  </p>
                </div>
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] font-mono text-stone-500">
                  <span>Edition World Wire</span>
                  <a
                    href="https://edition.cnn.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#9A3412] hover:underline"
                  >
                    edition.cnn.com <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive AI On-Demand Deep-Dive Synthesizer */}
          <div className="p-4 sm:p-5 border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/60">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#9A3412]" />
              On-Demand AI Tri-Source Synthesis Tool
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-3 font-sans">
              Request the AI engine to write a brand-new, impartial multi-source report on any developing global story right now:
            </p>

            <form onSubmit={handleGenerateDeepDive} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Enter topic (e.g., 'Kyiv power grid restoration' or 'Global central banks inflation')..."
                className="flex-1 px-3 py-2 text-xs font-mono bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#9A3412]"
              />
              <button
                type="submit"
                disabled={isGenerating || !topicInput.trim()}
                className="px-4 py-2 bg-[#9A3412] hover:bg-[#B45309] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Synthesize Unbiased Report</span>
                  </>
                )}
              </button>
            </form>

            {genError && (
              <p className="mt-2 text-xs font-mono text-rose-600 dark:text-rose-400">
                {genError}
              </p>
            )}

            {/* Generated Synthesis Display */}
            {generatedResult && (
              <div className="mt-4 p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                    ● Real-Time AI Synthesis Ready (Score: {generatedResult.neutralityScore}% Neutral)
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    Triangulated: BBC · Al Jazeera · CNN
                  </span>
                </div>

                <h4 className="font-editorial text-lg font-bold text-stone-950 dark:text-stone-50 mb-1">
                  {generatedResult.title}
                </h4>
                <p className="font-serif italic text-sm text-stone-700 dark:text-stone-300 mb-3">
                  {generatedResult.subtitle}
                </p>

                {/* Perspective Matrix */}
                {generatedResult.perspectives && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-3 p-2.5 bg-stone-50 dark:bg-stone-950 text-xs font-mono border border-stone-200 dark:border-stone-800">
                    <div>
                      <strong className="text-stone-900 dark:text-stone-100 block mb-0.5">BBC Angle:</strong>
                      <span className="text-stone-600 dark:text-stone-400 text-[11px] leading-tight block">
                        {generatedResult.perspectives.bbc}
                      </span>
                    </div>
                    <div>
                      <strong className="text-stone-900 dark:text-stone-100 block mb-0.5">Al Jazeera Angle:</strong>
                      <span className="text-stone-600 dark:text-stone-400 text-[11px] leading-tight block">
                        {generatedResult.perspectives.alJazeera}
                      </span>
                    </div>
                    <div>
                      <strong className="text-stone-900 dark:text-stone-100 block mb-0.5">CNN Angle:</strong>
                      <span className="text-stone-600 dark:text-stone-400 text-[11px] leading-tight block">
                        {generatedResult.perspectives.cnn}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-xs font-serif text-stone-800 dark:text-stone-200 leading-relaxed">
                  {generatedResult.content?.map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-stone-200 dark:border-stone-800 bg-[#F5F2EB] dark:bg-stone-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-stone-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Autonomous background synchronization active every 5 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onTriggerSync}
              disabled={isSyncing}
              className="px-3 py-1.5 bg-[#9A3412] hover:bg-[#B45309] text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
