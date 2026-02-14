
const isDevelopment = __DEV__;

const DEV_BASE_URL = 'http://192.168.1.131:8000'; // Local network IP (for backend development)
const PROD_BASE_URL = 'https://deepoct.id.vn';    // Production domain

const USE_PRODUCTION_URL = true; 
export const API_CONFIG = {
  BASE_URL: USE_PRODUCTION_URL ? PROD_BASE_URL : (isDevelopment ? DEV_BASE_URL : PROD_BASE_URL),
  
  TIMEOUT: 30000, 
  
  ENDPOINTS: {
    LOGIN: '/login',
    REGISTER: '/register',
    RESET_PASSWORD: '/reset-password',
    RESET_PASSWORD_CONFIRM: '/reset-password/otp-confirm',
    CHANGE_PASSWORD: '/reset-password/change-password',
    REFRESH_TOKEN: '/refresh-token',
    
    PROFILE: '/profile',
    UPDATE_PROFILE: '/profile',
    CHANGE_PASSWORD_IN_APP: '/change-password',
    DELETE_ACCOUNT: '/account',
    UPLOAD_AVATAR: '/avatar',
    
    PREDICT: '/predictions/predict',
    PREDICTION_HISTORY: '/predictions/history',
    PREDICTION_DETAIL: '/predictions',  
    DELETE_PREDICTION: '/predictions',  
  },
};


export const getBaseUrl = (): string => {
  if (USE_PRODUCTION_URL) {
    console.log('Using PRODUCTION URL:', PROD_BASE_URL);
    return PROD_BASE_URL;
  }
  
  if (isDevelopment) {
    console.log('Development mode - Using:', DEV_BASE_URL);
    return DEV_BASE_URL;
  }
  
  console.log('Production mode - Using:', PROD_BASE_URL);
  return PROD_BASE_URL;
};


export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${endpoint}`;
};


export const getHealthCheckUrl = (): string => {
  return buildApiUrl('/health');
};

export const ENV_INFO = {
  isDevelopment,
  useProductionUrl: USE_PRODUCTION_URL,
  baseUrl: getBaseUrl(),
  version: '2.0.0',
};

console.log('API Configuration:', {
  environment: isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION',
  useProductionUrl: USE_PRODUCTION_URL,
  baseUrl: getBaseUrl(),
  timeout: API_CONFIG.TIMEOUT,
});