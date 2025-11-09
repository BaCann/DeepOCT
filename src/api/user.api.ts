// src/api/user.api.ts
import apiClient from './client';
import {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordInAppRequest,
  DeleteAccountRequest,
} from '../types/user.types';

class UserApi {

  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>('/profile');
  }


  async updateProfile(data: UpdateProfileRequest): Promise<{ msg: string }> {
    return apiClient.put<{ msg: string }>('/profile', data);
  }


  async changePassword(data: ChangePasswordInAppRequest): Promise<{ msg: string }> {
    return apiClient.post<{ msg: string }>('/change-password', data);
  }


  async deleteAccount(data: DeleteAccountRequest): Promise<{ msg: string }> {
    return apiClient.delete<{ msg: string }>('/account', {
      data: data,
    });
  }
}

export default new UserApi();