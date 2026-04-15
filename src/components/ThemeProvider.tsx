'use client';

import * as React from 'react';

export type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  theme: ThemeMode;
  mounted: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
};

const STORAGE_KEY = 'theme';

const getSystemTheme = (): ThemeMode => (
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
);

const applyThemeToDocument = (theme: ThemeMode) => {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
};

const readInitialTheme = (): ThemeMode => {
  const savedTheme = window.localStorage.getItem(STORAGE_KEY);

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return getSystemTheme();
};

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = React.useState<ThemeMode>('dark');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const initialTheme = readInitialTheme();
    setThemeState(initialTheme);
    applyThemeToDocument(initialTheme);
    setMounted(true);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      const savedTheme = window.localStorage.getItem(STORAGE_KEY);

      if (savedTheme === 'light' || savedTheme === 'dark') {
        return;
      }

      const nextTheme = media.matches ? 'dark' : 'light';
      setThemeState(nextTheme);
      applyThemeToDocument(nextTheme);
    };

    media.addEventListener('change', handleSystemThemeChange);

    return () => {
      media.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const setTheme = React.useCallback((nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    applyThemeToDocument(nextTheme);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [setTheme, theme]);

  const value = React.useMemo<ThemeContextValue>(() => {
    return {
      theme,
      mounted,
      toggleTheme,
      setTheme,
    };
  }, [mounted, setTheme, theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const ThemeContext = React.createContext<ThemeContextValue>({
  theme: 'light',
  mounted: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const useTheme = () => React.useContext(ThemeContext);
