"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

type ThemeToggleProps = {
  className?: string;
  showLabel?: boolean;
};

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, mounted, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className={clsx(
        "group inline-flex items-center gap-2 rounded-full border px-2 py-1.5 text-sm font-semibold transition-all duration-300 ease-in-out",
        "border-border bg-[color:var(--surface)] text-foreground shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 hover:border-[color:var(--primary)] hover:shadow-[0_18px_36px_rgba(0,0,0,0.16)]",
        className
      )}
    >
      <span className="relative flex h-8 w-14 items-center rounded-full border border-border bg-[color:var(--control-bg)] p-1">
        <motion.span
          animate={{ x: isDark ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className={clsx(
            "absolute inset-y-1 left-1 flex h-6 w-6 items-center justify-center rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.18)]",
            "bg-[color:var(--primary)] text-[color:var(--background)]"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {mounted ? (
              <motion.span
                key={isDark ? "moon" : "sun"}
                initial={{ opacity: 0, scale: 0.75, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.75, rotate: 20 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center"
              >
                {isDark ? <Moon size={13} /> : <Sun size={13} />}
              </motion.span>
            ) : (
              <span className="flex items-center justify-center">
                <Sun size={13} />
              </span>
            )}
          </AnimatePresence>
        </motion.span>

        <span className="sr-only">{isDark ? "Dark theme" : "Light theme"}</span>
      </span>

      {showLabel ? (
        <span className="pr-1 text-[10px] font-bold uppercase tracking-[0.18em] text-foreground/70">
          {isDark ? "Dark" : "Light"}
        </span>
      ) : null}
    </motion.button>
  );
}
