import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  ApiResponse,
  ApiError,
  User,
} from '@/types/auth.types';

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'https://jdwd40.com/api-2',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getStoredToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            // If refresh fails, clear auth and redirect to login
            this.clearStoredAuth();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Token storage methods
  private getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }



  private setStoredTokens(token: string, refreshToken: string) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refreshToken);
  }

  private clearStoredAuth() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  // API methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.api.post(
        '/api/users/login',
        credentials
      );

      if (response.data.success && response.data.user && response.data.token) {
        const authResponse: AuthResponse = {
          user: response.data.user,
          token: response.data.token
        };
        this.setStoredTokens(response.data.token, ''); // No refresh token in this API
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return authResponse;
      } else {
        throw new Error(response.data.msg || 'Login failed');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        throw new Error(apiError?.message || 'Login failed');
      }
      throw error;
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.api.post(
        '/api/users/register',
        {
          username: credentials.username,
          email: credentials.email,
          password: credentials.password,
        }
      );

      if (response.data.success && response.data.user && response.data.token) {
        const authResponse: AuthResponse = {
          user: response.data.user,
          token: response.data.token
        };
        this.setStoredTokens(response.data.token, ''); // No refresh token in this API
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return authResponse;
      } else {
        throw new Error(response.data.msg || 'Registration failed');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        throw new Error(apiError?.message || 'Registration failed');
      }
      throw error;
    }
  }

  async refreshToken(): Promise<string> {
    // This API doesn't support refresh tokens, so we'll just return the current token
    const token = this.getStoredToken();
    if (!token) {
      throw new Error('No token available');
    }
    return token;
  }

  async logout(): Promise<void> {
    // This API doesn't have a logout endpoint, so we just clear local storage
    this.clearStoredAuth();
  }

  async getCurrentUser(): Promise<User> {
    try {
      // Since this API doesn't have a /me endpoint, we'll return the stored user
      const storedUser = this.getStoredUser();
      if (!storedUser) {
        throw new Error('No user data available');
      }
      return storedUser;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        this.clearStoredAuth();
      }
      throw error;
    }
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  getStoredUser(): any | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const authService = new AuthService();
export default authService; 