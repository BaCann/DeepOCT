// src/api/auth.api.ts
import apiClient from './client';
import { API_CONFIG } from './config';
import {
  UserLogin,
  UserRegister,
  LoginResponse,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordConfirm,
  ResetPasswordConfirmResponse,
  ChangePasswordRequest,
} from '../types/auth.types';

class AuthApi {
  /**
   * 🔐 Login
   */
  async login(credentials: UserLogin): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(API_CONFIG.ENDPOINTS.LOGIN, credentials);
  }

  /**
   * 📝 Register
   */
  async register(userData: UserRegister): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>(API_CONFIG.ENDPOINTS.REGISTER, userData);
  }

  /**
   * 📧 Request Reset Password (Send OTP)
   */
  async requestResetPassword(data: ResetPasswordRequest): Promise<{ msg: string }> {
    return apiClient.post<{ msg: string }>(API_CONFIG.ENDPOINTS.RESET_PASSWORD, data);
  }

  /**
   * ✅ Confirm OTP
   */
  async confirmOtp(data: ResetPasswordConfirm): Promise<ResetPasswordConfirmResponse> {
    return apiClient.post<ResetPasswordConfirmResponse>(
      API_CONFIG.ENDPOINTS.RESET_PASSWORD_CONFIRM,
      data
    );
  }

  /**
   * 🔑 Change Password
   */
  async changePassword(data: ChangePasswordRequest): Promise<{ msg: string }> {
    return apiClient.post<{ msg: string }>(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, data);
  }

  /**
   * 🔄 Refresh Token
   */
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(API_CONFIG.ENDPOINTS.REFRESH_TOKEN, {
      refresh_token: refreshToken,
    });
  }
}

export default new AuthApi();