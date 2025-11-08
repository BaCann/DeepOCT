import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, getBaseUrl } from './config';
import StorageService from '../utils/storage';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: getBaseUrl(),
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request Interceptor - Tự động thêm token vào header
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await StorageService.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor - Xử lý lỗi tự động
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Nếu lỗi 401 (Unauthorized) và chưa retry
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Thử refresh token
            const refreshToken = await StorageService.getRefreshToken();
            if (refreshToken) {
              const response = await this.client.post(API_CONFIG.ENDPOINTS.REFRESH_TOKEN, {
                refresh_token: refreshToken,
              });

              const { access_token, refresh_token: newRefreshToken } = response.data;

              // Lưu token mới
              await StorageService.setAccessToken(access_token);
              await StorageService.setRefreshToken(newRefreshToken);

              // Retry request với token mới
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
              }
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh token thất bại -> Logout
            await StorageService.clearAll();
            // TODO: Navigate to login screen
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // GET request
  async get<T>(url: string, config = {}): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  // POST request
  async post<T>(url: string, data?: any, config = {}): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  // PUT request
  async put<T>(url: string, data?: any, config = {}): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  // DELETE request
  async delete<T>(url: string, config = {}): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export default new ApiClient();