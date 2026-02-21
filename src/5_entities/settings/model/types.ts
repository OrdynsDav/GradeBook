export type ThemeMode = 'system' | 'light' | 'dark';

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
  setThemeMode: (mode: ThemeMode) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setNotificationType: (
    type: Exclude<keyof NotificationSettings, 'enabled'>,
    enabled: boolean
  ) => void;
  setNotifications: (patch: Partial<NotificationSettings>) => void;
  resetSettings: () => void;
}
