import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  msg: string;
  data?: T;
  user?: T;
  token?: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'https://jdwd40.com/api-2',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token and logging
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getStoredToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (import.meta.env.DEV) {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
            headers: config.headers,
          });
        }

        return config;
      },
      (error: AxiosError) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh and logging
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response in development
        if (import.meta.env.DEV) {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
          });
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Log error in development
        if (import.meta.env.DEV) {
          console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          });
        }

        // Handle 401 errors and token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            // If refresh fails, clear auth and redirect to login
            this.clearStoredAuth();
            toast.error('Session expired. Please login again.');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Handle other common errors
        const status = error.response?.status;
        if (status === 403) {
          toast.error('Access denied. You do not have permission to perform this action.');
        } else if (status === 404) {
          toast.error('Resource not found.');
        } else if (status && status >= 500) {
          toast.error('Server error. Please try again later.');
        } else if (!error.response) {
          toast.error('Network error. Please check your connection.');
        }

        return Promise.reject(error);
      }
    );
  }

  // Token management methods
  private getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /*
  private setStoredTokens(token: string, refreshToken: string) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refreshToken);
  }
  */

  private clearStoredAuth() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  private async refreshToken(): Promise<string> {
    // This API doesn't support refresh tokens, so we'll just return the current token
    const token = this.getStoredToken();
    if (!token) {
      throw new Error('No token available');
    }
    return token;
  }

  // Generic API methods
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.api.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put<T>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete<T>(url);
    return response.data;
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

export const apiService = new ApiService();
export default apiService; 