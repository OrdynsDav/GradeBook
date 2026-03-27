import type { Role, User as ApiUser } from '@shared/lib/api';

export type UserRole = Role;

/** Профиль пользователя — контракт API (`User`); для подписи группы используйте `group?.name`. */
export type User = ApiUser;

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  login: string;
  password: string;
}
