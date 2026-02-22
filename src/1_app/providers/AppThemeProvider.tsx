import React from 'react';
import { ThemeProvider } from '@shared/lib/theme';
import { useSettingsStore } from '@entities/settings';

/**
 * Composes shared ThemeProvider with settings entity.
 * FSD: app can depend on entities and shared.
 */
export const AppThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const syncWithServer = useSettingsStore((state) => state.syncWithServer);

  return (
    <ThemeProvider
      themeMode={themeMode}
      setThemeMode={setThemeMode}
      syncWithServer={syncWithServer}
    >
      {children}
    </ThemeProvider>
  );
};
