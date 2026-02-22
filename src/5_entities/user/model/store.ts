import { create } from 'zustand';
import { apiClient, UserApi, ApiRequestError } from '@shared/lib/api';
import { User, AuthState, LoginCredentials } from './types';

interface AuthStore extends AuthState {
  // State setters
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  
  // API actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

const mapApiUserToUser = (apiUser: any): User => ({
  ...apiUser,
  // Backward compatibility for existing UI
  classId: apiUser.classRoom?.id,
  className: apiUser.classRoom?.name,
});

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  login: async (credentials) => {
    try {
      // Не ставим isLoading: true — остаёмся на экране входа, показываем загрузку только на кнопке
      const authResponse = await apiClient.login(credentials);
      const user = mapApiUserToUser(authResponse.user);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      // Log error but continue with local logout
      console.warn('Logout API call failed:', error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  refreshUserData: async () => {
    try {
      const apiUser = await UserApi.getMe();
      const user = mapApiUserToUser(apiUser);
      set({ user, isAuthenticated: true });
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        set({
          user: null,
          isAuthenticated: false,
        });
      }
      throw error;
    }
  },

  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      
      if (await apiClient.isAuthenticated()) {
        const apiUser = await UserApi.getMe();
        const user = mapApiUserToUser(apiUser);
        
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.warn('Auth initialization failed:', error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
