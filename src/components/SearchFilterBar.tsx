import React, { useRef, useEffect } from 'react';
import { NewsCategory, Region } from '../types/news';
import { UIStrings } from '../data/languages';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeRegion: Region;
  onSelectRegion: (region: Region) => void;
  activeCategory: NewsCategory;
  onSelectCategory: (cat: NewsCategory) => void;
  sortBy: 'latest' | 'breaking' | 'mostRead';
  onSortChange: (sort: 'latest' | 'breaking' | 'mostRead') => void;
  ui: UIStrings;
  totalResults: number;
  onResetFilters: () => void;
  isFiltered: boolean;
  focusTrigger: number;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  activeRegion,
  onSelectRegion,
  activeCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  ui,
  totalResults,
  onResetFilters,
  isFiltered,
  focusTrigger,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusTrigger > 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusTrigger]);

  const regions: { id: Region; label: string }[] = [
    { id: 'all', label: ui.regions.all },
    { id: 'europe', label: ui.regions.europe },
    { id: 'asia-pacific', label: ui.regions['asia-pacific'] },
    { id: 'north-america', label: ui.regions['north-america'] },
    { id: 'latin-america', label: ui.regions['latin-america'] },
    { id: 'middle-east', label: ui.regions['middle-east'] },
    { id: 'africa', label: ui.regions.africa },
  ];

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 mb-8 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search input field */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={ui.searchPlaceholder}
            className="w-full pl-10 pr-9 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-[#9A3412]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort and status controls */}
        <div className="flex items-center gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-stone-500">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{ui.sortBy.label}:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 py-1.5 px-3 text-xs font-mono focus:outline-none focus:border-[#9A3412]"
          >
            <option value="latest">{ui.sortBy.latest}</option>
            <option value="breaking">{ui.sortBy.breaking}</option>
            <option value="mostRead">{ui.sortBy.mostRead}</option>
          </select>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="text-xs font-mono text-[#9A3412] hover:underline whitespace-nowrap pl-2 border-l border-stone-200 dark:border-stone-700"
            >
              {ui.resetFilters}
            </button>
          )}
        </div>
      </div>

      {/* Region Filter Segmented Tabs */}
      <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono uppercase text-stone-400 shrink-0 mr-1 hidden sm:inline">
            Region:
          </span>
          {regions.map((reg) => {
            const isSelected = activeRegion === reg.id;
            return (
              <button
                key={reg.id}
                onClick={() => onSelectRegion(reg.id)}
                className={`text-xs px-2.5 py-1 whitespace-nowrap shrink-0 transition-colors border ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 dark:bg-stone-950 dark:text-stone-400 dark:border-stone-800'
                }`}
              >
                {reg.label}
              </button>
            );
          })}
        </div>

        <span className="font-mono text-xs text-stone-400 shrink-0">
          {totalResults} {totalResults === 1 ? 'dispatch' : 'dispatches'}
        </span>
      </div>
    </div>
  );
};
