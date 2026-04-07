'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Maximize2 } from 'lucide-react';
import Image from 'next/image';

interface ImageSliderModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export function ImageSliderModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange
}: ImageSliderModalProps) {
  if (!isOpen || images.length === 0) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onIndexChange((currentIndex + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-10"
          onClick={onClose}
        >
          {/* Close button */}
          <motion.button
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-6 right-6 z-50 rounded-full bg-white/10 p-3 text-white/70 transition hover:bg-white/20 hover:text-white"
            onClick={onClose}
          >
            <X size={24} />
          </motion.button>

          {/* Navigation Info */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-full bg-white/10 px-6 py-3 backdrop-blur-xl border border-white/10">
            <p className="text-sm font-semibold tracking-widest text-white/80">
              {currentIndex + 1} / {images.length}
            </p>
          </div>

          {/* Main Content Area */}
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
            {/* Prev Button */}
            {images.length > 1 && (
              <button
                className="absolute left-4 z-50 flex h-14 w-14 items-center justify-center rounded-3xl bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white md:left-8"
                onClick={handlePrev}
              >
                <ChevronLeft size={32} />
              </button>
            )}

            {/* Slider Container */}
            <motion.div
              key={currentIndex}
              initial={{ x: 100, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -100, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="relative aspect-square max-h-full w-full max-w-[85vh] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full w-full overflow-hidden rounded-[32px] border border-white/20 bg-[#1a1a1a]">
                <Image
                  src={images[currentIndex]}
                  alt={`Product View ${currentIndex + 1}`}
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>
            </motion.div>

            {/* Next Button */}
            {images.length > 1 && (
              <button
                className="absolute right-4 z-50 flex h-14 w-14 items-center justify-center rounded-3xl bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white md:right-8"
                onClick={handleNext}
              >
                <ChevronRight size={32} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
