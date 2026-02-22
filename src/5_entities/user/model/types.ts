export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  role: UserRole;
  avatar?: string;
  classRoom?: {
    id: string;
    name: string;
    course: number;
    groupName: string;
  };
  createdAt: string;
  updatedAt: string;
  // Backward compatibility
  classId?: string;
  className?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  login: string;
  password: string;
}
