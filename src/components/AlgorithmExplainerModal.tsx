import React, { useState } from 'react';
import { AlgorithmWeights } from '../types/news';
import { UIStrings } from '../data/languages';
import { DEFAULT_ALGORITHM_WEIGHTS } from '../utils/rankingAlgorithm';
import { X, Sliders, RotateCcw, Check, Clock, ShieldCheck, TrendingUp, Info } from 'lucide-react';

interface AlgorithmExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  weights: AlgorithmWeights;
  onUpdateWeights: (newWeights: AlgorithmWeights) => void;
  ui: UIStrings;
}

export const AlgorithmExplainerModal: React.FC<AlgorithmExplainerModalProps> = ({
  isOpen,
  onClose,
  weights,
  onUpdateWeights,
  ui,
}) => {
  const [localWeights, setLocalWeights] = useState<AlgorithmWeights>(weights);

  if (!isOpen) return null;

  const handleRecencyChange = (val: number) => {
    const remaining = 1.0 - val;
    const currentSumOther = (localWeights.authority + localWeights.engagement) || 1;
    const authRatio = localWeights.authority / currentSumOther;
    const engRatio = localWeights.engagement / currentSumOther;

    setLocalWeights({
      recency: Math.round(val * 100) / 100,
      authority: Math.round(remaining * authRatio * 100) / 100,
      engagement: Math.round(remaining * engRatio * 100) / 100,
    });
  };

  const handleAuthorityChange = (val: number) => {
    const remaining = 1.0 - val;
    const currentSumOther = (localWeights.recency + localWeights.engagement) || 1;
    const recRatio = localWeights.recency / currentSumOther;
    const engRatio = localWeights.engagement / currentSumOther;

    setLocalWeights({
      recency: Math.round(remaining * recRatio * 100) / 100,
      authority: Math.round(val * 100) / 100,
      engagement: Math.round(remaining * engRatio * 100) / 100,
    });
  };

  const handleEngagementChange = (val: number) => {
    const remaining = 1.0 - val;
    const currentSumOther = (localWeights.recency + localWeights.authority) || 1;
    const recRatio = localWeights.recency / currentSumOther;
    const authRatio = localWeights.authority / currentSumOther;

    setLocalWeights({
      recency: Math.round(remaining * recRatio * 100) / 100,
      authority: Math.round(remaining * authRatio * 100) / 100,
      engagement: Math.round(val * 100) / 100,
    });
  };

  const handleReset = () => {
    setLocalWeights(DEFAULT_ALGORITHM_WEIGHTS);
  };

  const handleApply = () => {
    onUpdateWeights(localWeights);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 w-full max-w-xl shadow-2xl p-6 sm:p-8 relative font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 mb-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#9A3412] font-semibold block">
              Transparent Curation Engineering
            </span>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold">
              {ui.aggregationAlgorithm}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mathematical formulation card */}
        <div className="bg-[#F7F4EE] dark:bg-stone-950 p-4 border border-stone-200 dark:border-stone-800 mb-6 font-mono text-xs">
          <div className="text-stone-500 uppercase tracking-wider text-[10px] mb-1">
            Active Composite Formula
          </div>
          <div className="text-stone-900 dark:text-stone-100 font-bold leading-relaxed">
            Composite Score = ({Math.round(localWeights.recency * 100)}% × Recency) + ({Math.round(localWeights.authority * 100)}% × Authority) + ({Math.round(localWeights.engagement * 100)}% × Engagement)
          </div>
        </div>

        {/* Factor 1: Recency Velocity */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
            <span className="flex items-center gap-1.5 font-bold">
              <Clock className="w-3.5 h-3.5 text-[#9A3412]" />
              <span>1. {ui.recency} Weight</span>
            </span>
            <span className="font-bold text-[#9A3412]">
              {Math.round(localWeights.recency * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.80"
            step="0.05"
            value={localWeights.recency}
            onChange={(e) => handleRecencyChange(parseFloat(e.target.value))}
            className="w-full accent-[#9A3412] cursor-pointer"
          />
          <p className="text-[11px] font-serif italic text-stone-500 mt-1">
            Decays exponentially with time elapsed since publication. Rewards breaking dispatches.
          </p>
        </div>

        {/* Factor 2: Source Authority */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
            <span className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>2. {ui.sourceAuthority} Weight</span>
            </span>
            <span className="font-bold text-emerald-600">
              {Math.round(localWeights.authority * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.80"
            step="0.05"
            value={localWeights.authority}
            onChange={(e) => handleAuthorityChange(parseFloat(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <p className="text-[11px] font-serif italic text-stone-500 mt-1">
            Weights certified tier-1 wire services (Reuters: 98, AP: 97, Bloomberg: 96, BBC: 95).
          </p>
        </div>

        {/* Factor 3: User Engagement */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
            <span className="flex items-center gap-1.5 font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              <span>3. {ui.userEngagement} Weight</span>
            </span>
            <span className="font-bold text-indigo-600">
              {Math.round(localWeights.engagement * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.80"
            step="0.05"
            value={localWeights.engagement}
            onChange={(e) => handleEngagementChange(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <p className="text-[11px] font-serif italic text-stone-500 mt-1">
            Calculated from global reads, verified shares, and reader discussion velocity.
          </p>
        </div>

        {/* Presets buttons */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono">
          <span className="text-stone-400">Presets:</span>
          <button
            onClick={() => setLocalWeights({ recency: 0.60, authority: 0.25, engagement: 0.15 })}
            className="px-2 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            Breaking Priority
          </button>
          <button
            onClick={() => setLocalWeights({ recency: 0.20, authority: 0.65, engagement: 0.15 })}
            className="px-2 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            Highest Authority
          </button>
          <button
            onClick={() => setLocalWeights({ recency: 0.20, authority: 0.20, engagement: 0.60 })}
            className="px-2 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            Viral Trending
          </button>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-mono text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Weights</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-stone-600 hover:text-stone-900 dark:text-stone-400"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 bg-[#9A3412] hover:bg-[#B45309] text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply & Re-Rank</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
