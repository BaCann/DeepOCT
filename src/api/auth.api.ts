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

  async login(credentials: UserLogin): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(API_CONFIG.ENDPOINTS.LOGIN, credentials);
  }


  async register(userData: UserRegister): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>(API_CONFIG.ENDPOINTS.REGISTER, userData);
  }


  async requestResetPassword(data: ResetPasswordRequest): Promise<{ msg: string }> {
    return apiClient.post<{ msg: string }>(API_CONFIG.ENDPOINTS.RESET_PASSWORD, data);
  }


  async confirmOtp(data: ResetPasswordConfirm): Promise<ResetPasswordConfirmResponse> {
    return apiClient.post<ResetPasswordConfirmResponse>(
      API_CONFIG.ENDPOINTS.RESET_PASSWORD_CONFIRM,
      data
    );
  }


  async changePassword(data: ChangePasswordRequest): Promise<{ msg: string }> {
    return apiClient.post<{ msg: string }>(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, data);
  }


  // async refreshToken(refreshToken: string): Promise<LoginResponse> {
  //   return apiClient.post<LoginResponse>(API_CONFIG.ENDPOINTS.REFRESH_TOKEN, {
  //     refresh_token: refreshToken,
  //   });
  // }
}

export default new AuthApi();