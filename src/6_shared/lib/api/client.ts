import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  type AuthResponse,
  type LoginRequest,
  ApiRequestError,
  NetworkError,
} from './types';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export interface ApiClientConfig {
  baseURL: string;
  timeoutMs?: number;
}

export class ApiClient {
  private baseURL: string;
  private timeoutMs: number;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.timeoutMs = config.timeoutMs ?? 30000;
  }

  private async getStoredTokens(): Promise<{
    accessToken: string | null;
    refreshToken: string | null;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      AsyncStorage.getItem(ACCESS_TOKEN_KEY),
      AsyncStorage.getItem(REFRESH_TOKEN_KEY),
    ]);
    return { accessToken, refreshToken };
  }

  private async storeTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken),
      AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  }

  private async clearTokens(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
      AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
    ]);
  }

  private async attemptTokenRefresh(): Promise<string | null> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.doTokenRefresh();

    try {
      return await this.refreshPromise;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async doTokenRefresh(): Promise<string | null> {
    try {
      const { refreshToken } = await this.getStoredTokens();
      if (!refreshToken) return null;

      const response = await this.makeHttpRequest('/api/v1/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        await this.clearTokens();
        return null;
      }

      const authResponse: AuthResponse = await response.json();
      await this.storeTokens(authResponse.accessToken, authResponse.refreshToken);
      return authResponse.accessToken;
    } catch {
      await this.clearTokens();
      return null;
    }
  }

  private async makeHttpRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } catch (error: any) {
      if (__DEV__) {
        console.warn('[API] Request failed:', url, error?.message ?? error);
      }
      if (error.name === 'AbortError') {
        throw new NetworkError('Таймаут запроса. Проверьте, что сервер запущен на ' + this.baseURL);
      }
      const msg = error?.message ?? String(error);
      if (msg.includes('Network request failed') || msg.includes('fetch') || error?.name === 'TypeError') {
        throw new NetworkError('Не удалось подключиться к серверу. URL: ' + this.baseURL);
      }
      throw new NetworkError(msg || 'Сетевая ошибка');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async makeAuthenticatedRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const { accessToken } = await this.getStoredTokens();

    if (!accessToken) {
      throw new ApiRequestError(401, {
        statusCode: 401,
        message: 'No access token available',
        timestamp: new Date().toISOString(),
        path: endpoint,
        requestId: '',
      });
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    let response = await this.makeHttpRequest(endpoint, {
      ...options,
      headers,
    });

    // If access token expired, try to refresh
    if (response.status === 401) {
      const newAccessToken = await this.attemptTokenRefresh();

      if (!newAccessToken) {
        throw new ApiRequestError(401, {
          statusCode: 401,
          message: 'Session expired',
          timestamp: new Date().toISOString(),
          path: endpoint,
          requestId: '',
        });
      }

      // Retry with new token
      response = await this.makeHttpRequest(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    }

    return response;
  }

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await this.makeAuthenticatedRequest(endpoint, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        statusCode: response.status,
        message: response.statusText,
        timestamp: new Date().toISOString(),
        path: endpoint,
        requestId: '',
      }));
      throw new ApiRequestError(response.status, errorData);
    }

    return response.json();
  }

  async requestPublic<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await this.makeHttpRequest(endpoint, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        statusCode: response.status,
        message: response.statusText,
        timestamp: new Date().toISOString(),
        path: endpoint,
        requestId: '',
      }));
      throw new ApiRequestError(response.status, errorData);
    }

    return response.json();
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.requestPublic<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    await this.storeTokens(response.accessToken, response.refreshToken);
    return response;
  }

  async logout(): Promise<void> {
    try {
      const { refreshToken } = await this.getStoredTokens();
      if (refreshToken) {
        await this.requestPublic('/api/v1/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch {
      // Ignore logout errors - clear tokens anyway
    } finally {
      await this.clearTokens();
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const { accessToken } = await this.getStoredTokens();
    return !!accessToken;
  }
}

// Global API client instance
// Для эмулятора Android: 10.0.2.2:ПОРТ. Для реального устройства или если не работает — задайте EXPO_PUBLIC_API_URL (IP вашего ПК, напр. http://192.168.1.5:3000).
const apiBaseURL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) ||
  'https://gradebook-backend-xhw2.onrender.com';
export const apiClient = new ApiClient({ baseURL: apiBaseURL });