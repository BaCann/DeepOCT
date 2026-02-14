import authApi from '../api/auth.api';
import StorageService from '../utils/storage';

import {
  UserLogin,
  UserRegister,
  ResetPasswordRequest,
  ResetPasswordConfirm,
  ChangePasswordRequest,
  ApiError,
} from '../types/auth.types';
import { AxiosError } from 'axios';

class AuthService {

  async login(credentials: UserLogin): Promise<{ success: boolean; message: string }> {
    try {

      if (!credentials.email || !credentials.password) {
        return { success: false, message: 'Email and password are required' };
      }

      if (!this.isValidEmail(credentials.email)) {
        return { success: false, message: 'Please enter a valid email' };
      }


      const response = await authApi.login(credentials);


      await StorageService.setAccessToken(response.access_token);
      await StorageService.setRefreshToken(response.refresh_token);

      return { success: true, message: 'Login successful' };
    } catch (error) {
      return { success: false, message: this.handleError(error) };
    }
  }


  async register(userData: UserRegister): Promise<{ success: boolean; message: string }> {
    try {

      if (!userData.email || !userData.password || !userData.full_name) {
        return { success: false, message: 'Please fill in all required fields' };
      }

      if (!this.isValidEmail(userData.email)) {
        return { success: false, message: 'Please enter a valid email' };
      }

      if (userData.password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }


      const response = await authApi.register(userData);

      return { success: true, message: response.msg };
    } catch (error) {
      return { success: false, message: this.handleError(error) };
    }
  }


  async requestResetPassword(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!email || !this.isValidEmail(email)) {
        return { success: false, message: 'Please enter a valid email' };
      }

      const response = await authApi.requestResetPassword({ email });

      return { success: true, message: response.msg };
    } catch (error) {
      return { success: false, message: this.handleError(error) };
    }
  }


  async confirmOtp(
    otp: string
  ): Promise<{ success: boolean; message: string; resetToken?: string }> {
    try {
      if (!otp || otp.length !== 6) {
        return { success: false, message: 'Please enter a valid 6-digit OTP' };
      }

      const response = await authApi.confirmOtp({ otp });

      return {
        success: true,
        message: response.msg,
        resetToken: response.reset_token,
      };
    } catch (error) {
      return { success: false, message: this.handleError(error) };
    }
  }

    async resendOtp(email: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!email || !this.isValidEmail(email)) {
        return { success: false, message: 'Invalid email address' };
      }

      const response = await authApi.requestResetPassword({ email });

      return { success: true, message: response.msg };
    } catch (error) {
      return { success: false, message: this.handleError(error) };
    }
  }

  async changePassword(
    resetToken: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!newPassword || newPassword.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }

      const response = await authApi.changePassword({ reset_token: resetToken, new_password: newPassword });

      return { success: true, message: response.msg };
    } catch (error) {
      return { success: false, message: this.handleError(error) };
    }
  }


  // async logout(): Promise<void> {
  //   await StorageService.clearAll();
  //   authEvents.emit(AUTH_EVENTS.LOGOUT);
  // }


  async isAuthenticated(): Promise<boolean> {
    return await StorageService.isAuthenticated();
  }


  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private handleError(error: unknown): string {
    if (error instanceof AxiosError) {
      if (error.response) {

        const detail = error.response.data?.detail;
        if (typeof detail === 'string') {
          return detail;
        }
        return 'An error occurred. Please try again.';
      } else if (error.request) {
        return 'Cannot connect to server. Please check your internet connection.';
      }
    }
    return 'An unexpected error occurred';
  }
}

export default new AuthService();