

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  mobile_number: string;
  date_of_birth: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  mobile_number?: string;
  date_of_birth?: string;
}

export interface ChangePasswordInAppRequest {
  current_password: string;
  new_password: string;
}

export interface DeleteAccountRequest {
  password: string;
}