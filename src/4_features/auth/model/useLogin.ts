import { useState, useCallback } from 'react';
import { useAuthStore } from '@entities/user';
import { getApiErrorMessage } from '@shared/lib/api';
import type { LoginCredentials } from '@entities/user';

const DEFAULT_ERROR = 'Не удалось войти. Проверьте данные и повторите.';

export function useLogin() {
  const login = useAuthStore((state) => state.login);
  const [loginError, setLoginError] = useState('');

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      setLoginError('');
      try {
        await login(credentials);
      } catch (error) {
        setLoginError(getApiErrorMessage(error, DEFAULT_ERROR));
      }
    },
    [login]
  );

  return { handleLogin, loginError, setLoginError };
}
