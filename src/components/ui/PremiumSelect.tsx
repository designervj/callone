'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Check, X } from 'lucide-react';
import clsx from 'clsx';

export interface SelectOption {
  value: string;
  label: string;
  subLabel?: string;
  disabled?: boolean;
}

interface PremiumSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

export const PremiumSelect: React.FC<PremiumSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  label,
  icon,
  searchable = false,
  disabled = false,
  className,
  triggerClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      if (searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, searchable]);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opt.subLabel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    if (disabled) return;
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={clsx('relative w-full', className)} ref={containerRef}>
      {label && (
        <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={clsx(
          'flex h-[44px] w-full items-center justify-between rounded-xl border transition-all duration-300 outline-none',
          'px-5 py-3 text-[13px] font-bold text-foreground',
          isOpen 
            ? 'border-foreground/20 bg-surface shadow-[0_0_0_4px_rgba(var(--primary-rgb),0.06)]' 
            : 'border-border bg-surface backdrop-blur-sm hover:border-foreground/20 hover:bg-surface',
          disabled && 'opacity-50 cursor-not-allowed',
          triggerClassName
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {icon && <div className={clsx("shrink-0 transition-colors duration-300", isOpen ? "text-foreground" : "text-foreground/42")}>{icon}</div>}
          <span className={clsx('truncate transition-colors duration-300', !selectedOption && 'text-foreground/38')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isOpen && (
            <motion.div 
              layoutId="focus-bar"
              className="h-4 w-[2px] rounded-full bg-foreground shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]"
            />
          )}
          <ChevronDown 
            size={16} 
            className={clsx('shrink-0 text-foreground/34 transition-all duration-300', isOpen && 'rotate-180 text-foreground')} 
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 z-[100] mt-2 w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            {searchable && (
              <div className="border-b border-border/5 p-3">
                <div className="relative flex items-center rounded-xl bg-foreground/[0.03] px-4 py-2.5 transition-colors focus-within:bg-foreground/[0.06]">
                  <Search size={14} className="mr-3 text-foreground/20" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Quick search..."
                    className="w-full bg-transparent text-[12px] font-medium text-foreground outline-none placeholder:text-foreground/20"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="ml-2 text-foreground/20 hover:text-foreground">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className={clsx('max-h-[320px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-foreground/10')}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={clsx(
                      'group relative flex w-full flex-col items-start rounded-xl px-4 py-3 text-left transition-all',
                      value === option.value ? 'bg-foreground/[0.08] text-foreground' : 'text-foreground/60 hover:bg-foreground/[0.03] hover:text-foreground'
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-[12px] font-black uppercase tracking-wide">{option.label}</span>
                      {value === option.value && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Check size={14} strokeWidth={3} className="text-foreground" />
                        </motion.div>
                      )}
                    </div>
                    {option.subLabel && (
                      <span className={clsx(
                        'mt-1 text-[10px] font-bold uppercase tracking-widest transition-colors',
                        value === option.value ? 'text-foreground/70' : 'text-foreground/30 group-hover:text-foreground/40'
                      )}>
                        {option.subLabel}
                      </span>
                    )}
                    {value === option.value && (
                      <motion.div 
                        layoutId="active-item-indicator"
                        className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r-full bg-foreground"
                      />
                    )}
                  </button>
                ))
              ) : (
                <div className="py-10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">
                  No Database Records
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
