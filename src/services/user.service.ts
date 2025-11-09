// src/services/user.service.ts
import userApi from '../api/user.api';
import StorageService from '../utils/storage';
import {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordInAppRequest,
  DeleteAccountRequest,
} from '../types/user.types';
import { AxiosError } from 'axios';

class UserService {

  async getProfile(): Promise<{ success: boolean; data?: UserProfile; message: string }> {
    try {
      const profile = await userApi.getProfile();
      
      // Lưu profile vào storage
      await StorageService.setUserData(profile);
      
      return { success: true, data: profile, message: 'Profile loaded successfully' };
    } catch (error) {
      return { success: false, message: this.handleError(error) };
    }
  }


  async updateProfile(
    data: UpdateProfileRequest
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await userApi.updateProfile(data);
      
      // Update storage
      const currentProfile = await StorageService.getUserData();
      if (currentProfile) {
        await StorageService.setUserData({ ...currentProfile, ...data });
      }
      
      return { success: true, message: response.msg };
    } catch (error) {
      return { success: false, message: this.handleError(error) };
    }
  }


  async changePasswordInApp(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!currentPassword || !newPassword) {
        return { success: false, message: 'Please fill in all fields' };
      }

      if (newPassword.length < 6) {
        return { success: false, message: 'New password must be at least 6 characters' };
      }

      const response = await userApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      return { success: true, message: response.msg };
    } catch (error) {
      return { success: false, message: this.handleError(error) };
    }
  }


  async deleteAccount(password: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!password) {
        return { success: false, message: 'Please enter your password' };
      }

      const response = await userApi.deleteAccount({ password });

      // Clear all storage
      await StorageService.clearAll();

      return { success: true, message: response.msg };
    } catch (error) {
      return { success: false, message: this.handleError(error) };
    }
  }


  async logout(): Promise<void> {
    await StorageService.clearAll();
  }


  async getCachedProfile(): Promise<UserProfile | null> {
    return await StorageService.getUserData();
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

export default new UserService();