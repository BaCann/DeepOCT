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
}

export default new UserApi();