"use client";

import React from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';

interface Step {
  id: number;
  label: string;
}

interface CartStepperProps {
  steps: Step[];
  activeStep: number;
  isSubmitting: boolean;
  onSubmitOrder: () => void;
  onCheckAvailability: () => void;
  onApproveOrder: () => void;
  onCompleteOrder: () => void;
}

export const CartStepper: React.FC<CartStepperProps> = ({
  steps,
  activeStep,
  isSubmitting,
  onSubmitOrder,
  onCheckAvailability,
  onApproveOrder,
  onCompleteOrder,
}) => {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <div className="relative flex items-center gap-8 overflow-hidden rounded-[24px] border border-border bg-surface p-6 shadow-[0_18px_50px_rgba(0,0,0,0.1)]">
        
        {/* Horizontal Timeline Container */}
        <div className="relative flex flex-1 items-center justify-between px-10 py-12">
          {/* Background Track */}
          <div className="absolute left-[12%] right-[12%] top-1/2 h-[2px] -translate-y-1/2 bg-foreground/[0.08]" />
          
          {/* Active Progress Fill */}
          <motion.div 
            className="absolute left-[12%] top-1/2 h-[2px] -translate-y-1/2 bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, activeStep - 1) / (steps.length - 1) * 76)}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />

          {steps.map((step) => {
            const isCompleted = activeStep > step.id;
            const isActive = activeStep === step.id;
            const isUpcoming = activeStep < step.id;
            
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                {/* Milestone Node */}
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted ? 'var(--primary)' : isActive ? 'var(--surface)' : 'var(--surface-strong)',
                    color: isCompleted ? 'var(--surface)' : isActive ? 'var(--primary)' : 'var(--foreground)',
                    scale: isActive ? 1.2 : 1,
                    boxShadow: isActive ? '0 0 0 8px var(--primary-rgb, 0.08)' : 'none'
                  }}
                  className={clsx(
                    "flex h-[40px] w-[40px] items-center justify-center rounded-full border border-border transition-all duration-500 font-black",
                    isActive && "border-primary"
                  )}
                >
                  {isCompleted ? (
                    <Check size={18} strokeWidth={3.5} />
                  ) : (
                    <span className="text-sm italic">{step.id}</span>
                  )}
                </motion.div>

                {/* Vertical Symmetry Labels */}
                <div className="absolute -bottom-10 flex flex-col items-center whitespace-nowrap">
                  <span className={clsx(
                    "text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500",
                    isActive ? 'text-primary' : 'text-foreground/40'
                  )}>
                    {step.label}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="pulsar"
                      className="mt-2 h-1 w-1 rounded-full bg-primary"
                      animate={{ scale: [1, 2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </div>
                
                <div className="absolute -top-10 flex flex-col items-center whitespace-nowrap text-[8px] font-black uppercase tracking-[0.4em] text-foreground/40 italic">
                   Milestone 0{step.id}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Goal Anchor */}
        <div className="shrink-0 border-l border-border pl-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center"
            >
              <button
                onClick={
                  activeStep === 1 ? onSubmitOrder : 
                  activeStep === 2 ? onCheckAvailability : 
                  activeStep === 3 ? onApproveOrder : 
                  onCompleteOrder
                }
                disabled={isSubmitting}
                className={clsx(
                  "group relative flex h-16 min-w-[200px] items-center justify-center gap-4 overflow-hidden rounded-2xl bg-primary px-10 text-[11px] font-black uppercase tracking-[0.25em] text-surface shadow-2xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                )}
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-surface/20 border-t-surface" />
                ) : (
                  <ChevronRight size={18} className="translate-x-[-4px] text-surface transition-transform group-hover:translate-x-[-2px]" />
                )}
                <span className="relative z-10 text-surface">
                  {isSubmitting ? 'Sync' : 
                   activeStep === 1 ? 'Execute Submit' : 
                   activeStep === 2 ? 'Run Verify' : 
                   activeStep === 3 ? 'Final Approve' : 
                   'Ship Order'}
                </span>
                
                {/* Visual Accent */}
                <div className="absolute right-0 top-0 h-full w-[4px] bg-surface/20" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
