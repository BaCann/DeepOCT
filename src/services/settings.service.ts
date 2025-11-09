// src/services/settings.service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEYS = {
  DARK_MODE: '@settings/dark_mode',
  LANGUAGE: '@settings/language',
};

export type Language = 'en' | 'vi';

class SettingsService {

  async setDarkMode(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEYS.DARK_MODE, JSON.stringify(enabled));
    } catch (error) {
      console.error('Error saving dark mode:', error);
    }
  }

  async getDarkMode(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(SETTINGS_KEYS.DARK_MODE);
      return value ? JSON.parse(value) : false;
    } catch (error) {
      console.error('Error getting dark mode:', error);
      return false;
    }
  }


  async setLanguage(language: Language): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEYS.LANGUAGE, language);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }

  async getLanguage(): Promise<Language> {
    try {
      const value = await AsyncStorage.getItem(SETTINGS_KEYS.LANGUAGE);
      return (value as Language) || 'en';
    } catch (error) {
      console.error('Error getting language:', error);
      return 'en';
    }
  }
}

export default new SettingsService();