// src/api/user.api.ts
import apiClient from './client';
import { API_CONFIG } from './config';

import {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordInAppRequest,
  DeleteAccountRequest,
} from '../types/user.types';

class UserApi {

  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>(API_CONFIG.ENDPOINTS.PROFILE);
  }


  async updateProfile(data: UpdateProfileRequest): Promise<{ msg: string }> {
    return apiClient.put<{ msg: string }>(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, data);
  }


  async changePassword(data: ChangePasswordInAppRequest): Promise<{ msg: string }> {
    return apiClient.post<{ msg: string }>(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD_IN_APP, data);
  }


  async deleteAccount(data: DeleteAccountRequest): Promise<{ msg: string }> {
    return apiClient.delete<{ msg: string }>(API_CONFIG.ENDPOINTS.DELETE_ACCOUNT, {
      data: data,
    });
  }

async uploadAvatar(imageUri: string): Promise<UserProfile> {
    const formData = new FormData();
    
    formData.append('avatar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `avatar_${Date.now()}.jpg`,
    } as any);

    return apiClient.put<UserProfile>(
      API_CONFIG.ENDPOINTS.UPLOAD_AVATAR, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }
}

export default new UserApi();