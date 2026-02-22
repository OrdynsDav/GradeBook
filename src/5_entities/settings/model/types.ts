import type { ThemeMode } from '@shared/config/theme';
export type { ThemeMode } from '@shared/config/theme';

export interface NotificationSettings {
  enabled: boolean;
  grades: boolean;
  homework: boolean;
  announcements: boolean;
}

export interface SettingsState {
  themeMode: ThemeMode;
  notifications: NotificationSettings;
}

export interface SettingsActions {
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setNotificationType: (
    type: Exclude<keyof NotificationSettings, 'enabled'>,
    enabled: boolean
  ) => Promise<void>;
  setNotifications: (patch: Partial<NotificationSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}
