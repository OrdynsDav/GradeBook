import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import type { ThemeMode } from '@shared/config/theme';
import { createAppTheme, type AppTheme } from '@shared/config/theme';

type ResolvedThemeMode = 'light' | 'dark';

export interface ThemeContextValue {
  theme: AppTheme;
  themeMode: ThemeMode;
  resolvedMode: ResolvedThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const resolveThemeMode = (
  mode: ThemeMode,
  systemScheme: 'light' | 'dark' | null | undefined
): ResolvedThemeMode => {
  if (mode === 'system') return systemScheme === 'dark' ? 'dark' : 'light';
  return mode;
};

export interface ThemeProviderProps {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  syncWithServer?: () => void;
  children: React.ReactNode;
}

/**
 * Presentational theme provider. Does not depend on entities.
 * App layer composes it with settings store (see AppThemeProvider).
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  themeMode,
  setThemeMode,
  syncWithServer,
  children,
}) => {
  const systemScheme = useColorScheme();

  React.useEffect(() => {
    syncWithServer?.();
  }, [syncWithServer]);

  const resolvedMode = resolveThemeMode(themeMode, systemScheme);
  const theme = createAppTheme(resolvedMode);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      themeMode,
      resolvedMode,
      isDark: resolvedMode === 'dark',
      setThemeMode,
    }),
    [theme, themeMode, resolvedMode, setThemeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
};
