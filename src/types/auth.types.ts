export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  email: string;
  password: string;
  full_name: string;
  mobile_number: string;
  date_of_birth: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RegisterResponse {
  msg: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordConfirm {
  otp: string;
}

export interface ResetPasswordConfirmResponse {
  reset_token: string;
  token_type: string;
  msg: string;
}

export interface ChangePasswordRequest {
  reset_token: string;
  new_password: string;
}

export interface ApiError {
  detail: string;
  status?: number;
}