export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  role: UserRole;
  avatar?: string;
  classId?: string;
  className?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
