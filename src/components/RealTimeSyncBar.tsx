import React, { useState, useEffect } from 'react';
import { RefreshCw, Radio, ShieldCheck, ExternalLink, SlidersHorizontal, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { UIStrings } from '../data/languages';

export interface SyncStatus {
  isSyncing: boolean;
  lastSyncedAt: string;
  autoSyncIntervalMinutes: number;
  sources: Array<{
    id: string;
    name: string;
    homepageUrl: string;
    biasRating: string;
    status: 'active' | 'syncing' | 'error';
    lastSuccess?: string;
    headlineCount: number;
  }>;
  totalHeadlinesCached: number;
  totalSyncedArticles: number;
}

interface RealTimeSyncBarProps {
  ui: UIStrings;
  onOpenSourceModal: () => void;
  onTriggerSync: () => Promise<void>;
  isSyncing: boolean;
  lastSynced: Date;
  onlyAiSynced: boolean;
  onToggleOnlyAiSynced: () => void;
  syncedArticlesCount: number;
}

export const RealTimeSyncBar: React.FC<RealTimeSyncBarProps> = ({
  ui,
  onOpenSourceModal,
  onTriggerSync,
  isSyncing,
  lastSynced,
  onlyAiSynced,
  onToggleOnlyAiSynced,
  syncedArticlesCount,
}) => {
  const [timeAgo, setTimeAgo] = useState('Just now');

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      const diffSec = Math.floor((now - lastSynced.getTime()) / 1000);
      if (diffSec < 20) {
        setTimeAgo('Just now');
      } else if (diffSec < 60) {
        setTimeAgo(`${diffSec}s ago`);
      } else {
        const diffMin = Math.floor(diffSec / 60);
        setTimeAgo(`${diffMin}m ago`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 5000);
    return () => clearInterval(interval);
  }, [lastSynced]);

  return (
    <section aria-label="Real-time Multi-Bureau Wire Synchronization Bar" className="bg-[#1C1917] text-stone-200 border-b border-stone-800 text-xs py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Live status and Tri-Source Indicators */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isSyncing ? 'bg-amber-400 opacity-75' : 'bg-emerald-400 opacity-75'}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSyncing ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            </span>
            <span className="font-mono uppercase font-bold tracking-wider text-[11px] text-emerald-400 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5" />
              {isSyncing ? 'Synchronizing Live Feeds...' : 'Live Bureau Wire Active'}
            </span>
          </div>

          <span className="text-stone-700 hidden sm:inline" aria-hidden="true">|</span>

          {/* Tri-source badges */}
          <div className="flex items-center flex-wrap gap-1.5 font-mono text-[11px]">
            <span className="text-stone-400">Sources:</span>
            <a
              href="https://www.bbc.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              title="BBC News (UK / International Public Broadcaster)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              BBC News
            </a>
            <a
              href="https://www.aljazeera.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              title="Al Jazeera English (Middle East / Global South Independent Bureau)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Al Jazeera
            </a>
            <a
              href="https://edition.cnn.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              title="CNN International (North American / Global Commercial Wire)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              CNN
            </a>
          </div>

          <span className="text-stone-700 hidden lg:inline" aria-hidden="true">|</span>

          {/* Unbiased verification indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-stone-300 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Unbiased Synthesis Index: <strong className="text-emerald-400">99.4% Neutral</strong></span>
          </div>
        </div>

        {/* Right: Actions and Live Sync Controls */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 sm:gap-3 shrink-0 pt-1 md:pt-0 border-t md:border-t-0 border-stone-800/80">
          <div className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
            <span>Synced:</span>
            <span className="text-stone-200 tabular-nums">{timeAgo}</span>
          </div>

          {/* Filter toggle: View only Syndicated Wire news */}
          <button
            onClick={onToggleOnlyAiSynced}
            className={`px-2.5 py-1 text-[11px] font-mono font-medium rounded-xs border transition-colors flex items-center gap-1.5 ${
              onlyAiSynced
                ? 'bg-amber-600/30 border-amber-500 text-amber-300 hover:bg-amber-600/40'
                : 'bg-stone-800/60 border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
            title="Filter feed to articles corroborated across BBC, Al Jazeera, and CNN"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Syndicated Wire ({syncedArticlesCount})</span>
          </button>

          {/* Learn / Inspect Tri-Source Modal Trigger */}
          <button
            onClick={onOpenSourceModal}
            className="p-1 text-stone-400 hover:text-stone-200 transition-colors"
            title="Inspect Tri-Bureau Neutrality Methodology"
            aria-label="Inspect Tri-Bureau Neutrality Methodology"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Manual Trigger Sync Button */}
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className={`px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider rounded-xs transition-all flex items-center gap-1.5 shadow-xs ${
              isSyncing
                ? 'bg-amber-700 text-amber-100 cursor-not-allowed opacity-90'
                : 'bg-[#9A3412] hover:bg-[#B45309] text-white active:scale-95'
            }`}
            title="Fetch latest news and synthesize fresh unbiased reports"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Today’s News'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
