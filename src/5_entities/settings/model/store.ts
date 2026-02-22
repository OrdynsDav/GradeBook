import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SettingsApi } from '@shared/lib/api';
import type { NotificationSettings, SettingsActions, SettingsState } from './types';

type SettingsStore = SettingsState & SettingsActions & {
  isLoading: boolean;
  syncWithServer: () => Promise<void>;
};
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
    (set, get) => ({
      ...createInitialState(),
      isLoading: false,

      setThemeMode: async (mode) => {
        const oldState = get();
        const newState = { ...oldState, themeMode: mode };
        set(newState);

        try {
          await SettingsApi.updateSettings({ themeMode: mode });
        } catch (error) {
          console.warn('Failed to sync theme mode to server:', error);
          // Local setting is preserved even if server sync fails
        }
      },

      setNotificationsEnabled: async (enabled) => {
        const oldState = get();
        const newNotifications = { ...oldState.notifications, enabled };
        const newState = { ...oldState, notifications: newNotifications };
        set(newState);

        try {
          await SettingsApi.updateSettings({ notifications: newNotifications });
        } catch (error) {
          console.warn('Failed to sync notification setting to server:', error);
        }
      },

      setNotificationType: async (type: NotificationType, enabled: boolean) => {
        const oldState = get();
        const newNotifications = { ...oldState.notifications, [type]: enabled };
        const newState = { ...oldState, notifications: newNotifications };
        set(newState);

        try {
          await SettingsApi.updateSettings({ notifications: newNotifications });
        } catch (error) {
          console.warn('Failed to sync notification type to server:', error);
        }
      },

      setNotifications: async (patch) => {
        const oldState = get();
        const newNotifications = { ...oldState.notifications, ...patch };
        const newState = { ...oldState, notifications: newNotifications };
        set(newState);

        try {
          await SettingsApi.updateSettings({ notifications: newNotifications });
        } catch (error) {
          console.warn('Failed to sync notifications to server:', error);
        }
      },

      resetSettings: async () => {
        const initialState = createInitialState();
        set(initialState);

        try {
          await SettingsApi.updateSettings(initialState);
        } catch (error) {
          console.warn('Failed to reset settings on server:', error);
        }
      },

      syncWithServer: async () => {
        try {
          set({ isLoading: true });
          const serverSettings = await SettingsApi.getSettings();
          const base = createInitialNotifications();
          const notifications: NotificationSettings = {
            enabled: serverSettings.notifications?.enabled ?? base.enabled,
            grades: serverSettings.notifications?.grades ?? base.grades,
            homework: serverSettings.notifications?.homework ?? base.homework,
            announcements: serverSettings.notifications?.announcements ?? base.announcements,
          };
          set({
            themeMode: serverSettings.themeMode,
            notifications,
            isLoading: false,
          });
        } catch (error) {
          console.warn('Failed to sync settings from server:', error);
          // Keep local settings if server is unavailable
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ themeMode, notifications }) => ({ themeMode, notifications }),
    }
  )
);
