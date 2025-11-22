// src/api/config.ts
export const API_CONFIG = {
  //BASE_URL: 'http://localhost:8000', // Khi test trên máy tính
  BASE_URL: 'http://192.168.1.102:8000', // Khi test trên điện thoại (thay IP máy tính)
  // BASE_URL: 'https://your-domain.com', // Production
  
  TIMEOUT: 10000, // 10 seconds
  
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/login',
    REGISTER: '/register',
    RESET_PASSWORD: '/reset-password',
    RESET_PASSWORD_CONFIRM: '/reset-password/otp-confirm',
    CHANGE_PASSWORD: '/reset-password/change-password',
    REFRESH_TOKEN: '/refresh-token',
    
    // User endpoints
    PROFILE: '/profile',
    UPDATE_PROFILE: '/profile',
    CHANGE_PASSWORD_IN_APP: '/change-password',
    DELETE_ACCOUNT: '/account',
    
    // Prediction endpoints
    PREDICT: '/predictions/predict',
    PREDICTION_HISTORY: '/predictions/history',
    PREDICTION_DETAIL: '/predictions',  // + /{id}
    DELETE_PREDICTION: '/predictions',  // + /{id}
  },
};

export const getBaseUrl = (): string => {
  // Tự động detect môi trường
  if (__DEV__) {
    // Development mode
    return API_CONFIG.BASE_URL;
  }
  // Production mode
  return 'https://your-production-api.com';
};