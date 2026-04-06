'use client';

import React from "react";

interface SkuQuantityInputProps {
  value: number;
  maxStock: number;
  onChange: (val: number) => void;
}

export function SkuQuantityInput({
  value,
  maxStock,
  onChange,
}: SkuQuantityInputProps) {
  const isError = value > maxStock || value < 0;

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value) || 0);
  };

  return (
    <div 
      className={`inline-flex items-stretch overflow-hidden rounded-xl border transition-all duration-200 ${
        isError 
          ? "border-red-500 bg-red-500/5 ring-1 ring-red-500/20" 
          : "border-border/60 bg-background"
      }`}
      style={{ height: "36px" }}
    >
      {/* Stock Display */}
      <div 
        className={`flex items-center justify-center px-2.5 text-xs font-bold ${
          isError ? "bg-red-500/10 text-red-500" : "bg-foreground/5 text-foreground/60"
        }`}
        style={{ minWidth: "32px", borderRight: "1px solid currentColor", opacity: isError ? 1 : 0.4 }}
      >
        {maxStock}
      </div>

      {/* Input Field */}
      <input
        type="number"
        value={value}
        onChange={handleManualChange}
        className={`w-12 bg-transparent px-2 text-center text-xs font-semibold focus:outline-none ${
          isError ? "text-red-500" : "text-foreground"
        }`}
      />

      {/* Stepper Controls */}
      <div className="flex flex-col border-l border-border/40">
        <button
          onClick={() => onChange(value + 1)}
          className="flex flex-1 items-center justify-center px-1.5 text-[8px] hover:bg-foreground/5 transition-colors"
          aria-label="Increase quantity"
        >
          ▲
        </button>
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex flex-1 items-center justify-center border-t border-border/40 px-1.5 text-[8px] hover:bg-foreground/5 transition-colors"
          aria-label="Decrease quantity"
        >
          ▼
        </button>
      </div>
    </div>
  );
}
