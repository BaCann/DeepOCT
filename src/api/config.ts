export const API_CONFIG = {
  // Thay đổi theo môi trường của bạn
  //BASE_URL: 'http://localhost:8000', // Khi test trên máy tính
  BASE_URL: 'http://192.168.1.157:8000', // Khi test trên điện thoại (thay IP máy tính)
  // BASE_URL: 'https://your-domain.com', // Production
  
  TIMEOUT: 10000, // 10 seconds
  
  ENDPOINTS: {
    LOGIN: '/login',
    REGISTER: '/register',
    RESET_PASSWORD: '/reset-password',
    RESET_PASSWORD_CONFIRM: '/reset-password/otp-confirm',
    CHANGE_PASSWORD: '/reset-password/change-password',
    REFRESH_TOKEN: '/refresh-token',
  },
};


export const getBaseUrl = (): string => {

  if (__DEV__) {
    // Development mode
    return API_CONFIG.BASE_URL;
  }
  // Production mode
  return 'https://your-production-api.com';
};