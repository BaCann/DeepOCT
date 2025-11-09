// src/theme/colors.ts

export const lightTheme = {
  // Background
  background: '#FFFFFF',
  backgroundSecondary: '#F8FAFC',
  
  // Primary
  primary: '#2260FF',
  primaryLight: '#ECF1FF',
  primaryDark: '#1850E0',
  
  // Text
  text: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  
  // Border
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  
  // Status
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Card
  card: '#FFFFFF',
  cardShadow: 'rgba(0, 0, 0, 0.05)',
  
  // Input
  input: '#ECF1FF',
  placeholder: '#B5C9FF',
  
  // Icon
  icon: '#64748B',
  iconActive: '#2260FF',
};

export const darkTheme = {
  // Background
  background: '#0F172A',
  backgroundSecondary: '#1E293B',
  
  // Primary
  primary: '#3B82F6',
  primaryLight: '#1E3A8A',
  primaryDark: '#60A5FA',
  
  // Text
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  
  // Border
  border: '#334155',
  borderLight: '#475569',
  
  // Status
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Card
  card: '#1E293B',
  cardShadow: 'rgba(0, 0, 0, 0.3)',
  
  // Input
  input: '#334155',
  placeholder: '#64748B',
  
  // Icon
  icon: '#94A3B8',
  iconActive: '#3B82F6',
};

export type Theme = typeof lightTheme;