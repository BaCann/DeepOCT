// src/api/config.ts

// Detect environment
const isDevelopment = __DEV__;

// Base URLs for different environments
const DEV_BASE_URL = 'http://192.168.1.131:8000'; // Local network IP (for backend development)
const PROD_BASE_URL = 'https://deepoct.id.vn';    // Production domain

// Configuration flag: Set to true to always use production domain
const USE_PRODUCTION_URL = true; 
export const API_CONFIG = {
  // Use production URL if flag is set, otherwise use environment-based URL
  BASE_URL: USE_PRODUCTION_URL ? PROD_BASE_URL : (isDevelopment ? DEV_BASE_URL : PROD_BASE_URL),
  
  TIMEOUT: 30000, // 30 seconds (increased for ML inference)
  
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
    UPLOAD_AVATAR: '/avatar',
    
    // Prediction endpoints
    PREDICT: '/predictions/predict',
    PREDICTION_HISTORY: '/predictions/history',
    PREDICTION_DETAIL: '/predictions',  // + /{id}
    DELETE_PREDICTION: '/predictions',  // + /{id}
  },
};

/**
 * Get base URL based on configuration
 * @returns Base URL string
 */
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

/**
 * Build full API URL
 * @param endpoint - Endpoint path
 * @returns Full URL
 */
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${endpoint}`;
};

/**
 * API Health check
 * @returns Health check URL
 */
export const getHealthCheckUrl = (): string => {
  return buildApiUrl('/health');
};

// Export environment info for debugging
export const ENV_INFO = {
  isDevelopment,
  useProductionUrl: USE_PRODUCTION_URL,
  baseUrl: getBaseUrl(),
  version: '2.0.0',
};

// Log current configuration
console.log('API Configuration:', {
  environment: isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION',
  useProductionUrl: USE_PRODUCTION_URL,
  baseUrl: getBaseUrl(),
  timeout: API_CONFIG.TIMEOUT,
});