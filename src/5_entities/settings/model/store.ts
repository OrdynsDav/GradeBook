import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { NotificationSettings, SettingsActions, SettingsState } from './types';

type SettingsStore = SettingsState & SettingsActions;
type NotificationType = Exclude<keyof NotificationSettings, 'enabled'>;

const createInitialNotifications = (): NotificationSettings => ({
  enabled: true,
  grades: true,
  homework: true,
  announcements: true,
});

const createInitialState = (): SettingsState => ({
  themeMode: 'system',
  notifications: createInitialNotifications(),
});

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...createInitialState(),
      setThemeMode: (mode) => set({ themeMode: mode }),
      setNotificationsEnabled: (enabled) =>
        set((state) => ({
          notifications: { ...state.notifications, enabled },
        })),
      setNotificationType: (type: NotificationType, enabled: boolean) =>
        set((state) => ({
          notifications: { ...state.notifications, [type]: enabled },
        })),
      setNotifications: (patch) =>
        set((state) => ({
          notifications: { ...state.notifications, ...patch },
        })),
      resetSettings: () => set(createInitialState()),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ themeMode, notifications }) => ({ themeMode, notifications }),
    }
  )
);
