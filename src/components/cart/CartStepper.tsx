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
      <div className="relative flex items-center gap-8 overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.03] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
        
        {/* Horizontal Timeline Container */}
        <div className="relative flex flex-1 items-center justify-between px-10 py-12">
          {/* Background Track */}
          <div className="absolute left-[12%] right-[12%] top-1/2 h-[2px] -translate-y-1/2 bg-white/[0.06]" />
          
          {/* Active Progress Fill */}
          <motion.div 
            className="absolute left-[12%] top-1/2 h-[2px] -translate-y-1/2 bg-white"
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
                    backgroundColor: isCompleted ? 'rgba(255,255,255,0.9)' : isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.16)',
                    scale: isActive ? 1.2 : 1,
                    boxShadow: isActive ? '0 0 0 8px rgba(255, 255, 255, 0.08)' : 'none'
                  }}
                  className={clsx(
                    "flex h-[40px] w-[40px] items-center justify-center rounded-full transition-all duration-500",
                    (isCompleted || isActive) ? 'text-background shadow-xl' : 'text-foreground/62 bg-white/[0.08]'
                  )}
                >
                  {isCompleted ? (
                    <Check size={18} strokeWidth={3.5} />
                  ) : (
                    <span className="text-sm font-black italic">{step.id}</span>
                  )}
                </motion.div>

                {/* Vertical Symmetry Labels */}
                <div className="absolute -bottom-10 flex flex-col items-center whitespace-nowrap">
                  <span className={clsx(
                    "text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500",
                    isActive ? 'text-white' : 'text-foreground/20'
                  )}>
                    {step.label}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="pulsar"
                      className="mt-2 h-1 w-1 rounded-full bg-white"
                      animate={{ scale: [1, 2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </div>
                
                <div className="absolute -top-10 flex flex-col items-center whitespace-nowrap text-[8px] font-black uppercase tracking-[0.4em] text-foreground/62 italic">
                   Milestone 0{step.id}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Goal Anchor */}
        <div className="shrink-0 border-l border-white/8 pl-8">
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
                  "group relative flex h-16 min-w-[200px] items-center justify-center gap-4 overflow-hidden rounded-2xl bg-white px-10 text-[11px] font-black uppercase tracking-[0.25em] text-background shadow-2xl transition-all hover:bg-white/92 active:scale-95 disabled:opacity-50"
                )}
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background/20 border-t-background" />
                ) : (
                  <ChevronRight size={18} className="translate-x-[-4px] text-background transition-transform group-hover:translate-x-[-2px]" />
                )}
                <span className="relative z-10">
                  {isSubmitting ? 'Sync' : 
                   activeStep === 1 ? 'Execute Submit' : 
                   activeStep === 2 ? 'Run Verify' : 
                   activeStep === 3 ? 'Final Approve' : 
                   'Ship Order'}
                </span>
                
                {/* Visual Accent */}
                <div className="absolute right-0 top-0 h-full w-[4px] bg-background/80" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
