'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown, Check } from 'lucide-react';
import clsx from 'clsx';

export type FilterOperator = 'contains' | 'notContains' | 'equals' | 'notEquals' | 'startsWith' | 'endsWith' | 'blank' | 'notBlank';

export interface ColumnFilterData {
  // Changed from [] to string[] for clarity
  selection: string[]; 
  operator: FilterOperator;
  searchValue: string;
}

const OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: 'contains', label: 'Contains' },
  { value: 'notContains', label: 'Does not contain' },
  { value: 'equals', label: 'Equals' },
  { value: 'notEquals', label: 'Does not equal' },
  { value: 'startsWith', label: 'Begins with' },
  { value: 'endsWith', label: 'Ends with' },
  { value: 'blank', label: 'Blank' },
  { value: 'notBlank', label: 'Not blank' },
];

interface FilterProps {
  columnKey: string;
  uniqueValues: string[];
  currentFilter: ColumnFilterData;
  onFilterChange: (key: string, data: Partial<ColumnFilterData>) => void;
  columnLabel: string;
}

export function SelectionFilter({ columnKey, uniqueValues, currentFilter, onFilterChange, columnLabel }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ensure selection is always an array to prevent .length crashes
  const selections = Array.isArray(currentFilter.selection) ? currentFilter.selection : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const isActive = selections.length > 0;

  // Generate the label for the button
  const getButtonLabel = () => {
    if (selections.length === 0) return columnLabel;
    if (selections.length === 1) return selections[0] || '(Empty)';
    return `${selections.length} Selected`;
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex min-w-[110px] items-center justify-between gap-2 rounded px-2 py-1.5 text-xs font-semibold transition-all",
          isActive 
            ? "bg-white/15 text-white shadow-sm" 
            : "bg-transparent text-zinc-300 hover:bg-white/10"
        )}
      >
        <span className="truncate">{getButtonLabel()}</span>
        <ChevronDown size={12} className={clsx('shrink-0 transition-transform opacity-60', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute left-0 top-full z-[100] mt-1 max-h-72 w-56 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xl flex flex-col"
          >
            <div className="p-1 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <button
                onClick={() => onFilterChange(columnKey, { selection: [] })}
                className={clsx(
                  "flex w-full items-center justify-between rounded px-2 py-2 text-left text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
                  selections.length === 0 ? "text-blue-600 dark:text-blue-400" : "text-zinc-500 dark:text-zinc-400"
                )}
              >
                <span>{columnLabel}</span>
                {selections.length === 0 && <Check size={14} strokeWidth={3} />}
              </button>
            </div>

            <div className="overflow-y-auto p-1 custom-scrollbar">
              {uniqueValues.map(val => {
                const isSelected = selections.includes(val);
                return (
                  <button
                    key={val}
                    onClick={() => {
                      // Handled by the toggle logic in the parent component
                      onFilterChange(columnKey, { selection: val as any });
                    }}
                    className={clsx(
                      "flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors group",
                      isSelected ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20" : "text-zinc-700 dark:text-zinc-300"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className={clsx(
                        "h-3 w-3 rounded-[3px] border flex items-center justify-center transition-colors",
                        isSelected ? "bg-blue-600 border-blue-600" : "border-zinc-300 dark:border-zinc-700 group-hover:border-zinc-400"
                      )}>
                        {isSelected && <Check size={10} className="text-white" strokeWidth={4} />}
                      </div>
                      <span className="truncate">{val || '(Empty)'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// FloatingFilterPopup remains largely the same, but ensure it interacts correctly 
// with the parent logic that clears selections when searching.
export function FloatingFilterPopup({ columnKey, currentFilter, onFilterChange }: Omit<FilterProps, 'uniqueValues' | 'columnLabel'>) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempOperator, setTempOperator] = useState<FilterOperator>(currentFilter.operator);
  const [tempValue, setTempValue] = useState(currentFilter.searchValue);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempOperator(currentFilter.operator);
    setTempValue(currentFilter.searchValue);
  }, [currentFilter]);

  const handleApply = () => {
    onFilterChange(columnKey, { operator: tempOperator, searchValue: tempValue });
    setIsOpen(false);
  };

  const handleReset = () => {
    onFilterChange(columnKey, { operator: 'contains', searchValue: '' });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const isActive = currentFilter.searchValue !== '' || currentFilter.operator === 'blank' || currentFilter.operator === 'notBlank';

  return (
    <div className="flex items-center gap-1.5" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex h-7 w-7 items-center justify-center rounded-md transition-all",
          isActive 
            ? "bg-white/20 text-white shadow-sm" 
            : "text-zinc-400 hover:bg-white/10 hover:text-white"
        )}
      >
        <Filter size={12} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute left-0 top-full z-[110] mt-1 w-64 rounded-xl border border-border bg-surface p-4 shadow-2xl"
          >
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-foreground">Operation</label>
                <select
                  value={tempOperator}
                  onChange={(e) => setTempOperator(e.target.value as FilterOperator)}
                  className="w-full rounded-lg border border-border bg-surface-elevated/20 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                >
                  {OPERATORS.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-foreground">Value</label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground" />
                  <input
                    autoFocus
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    placeholder="Filter..."
                    onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                    className="w-full rounded-lg border border-border bg-surface-elevated/20 py-2 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={handleReset}
                  className="rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground hover:bg-card/5 hover:text-foreground"
                >
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  className="rounded-lg bg-primary px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white dark:text-zinc-400 transition-opacity hover:opacity-90"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}