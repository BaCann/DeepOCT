// screen/SettingScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation, useFocusEffect, CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../App';
import userService from '../src/services/user.service';
import settingsService, { Language } from '../src/services/settings.service';
import { UserProfile } from '../src/types/user.types';

type SettingScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

const SettingScreen = () => {
  const navigation = useNavigation<SettingScreenNavigationProp>();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  // Load settings và profile khi màn hình focus
  useFocusEffect(
    React.useCallback(() => {
      loadSettings();
      loadProfile();
    }, [])
  );

  const loadSettings = async () => {
    const savedDarkMode = await settingsService.getDarkMode();
    const savedLanguage = await settingsService.getLanguage();
    setDarkMode(savedDarkMode);
    setLanguage(savedLanguage);
  };

  const loadProfile = async () => {
    setLoading(true);
    const result = await userService.getProfile();
    if (result.success && result.data) {
      setProfile(result.data);
    }
    setLoading(false);
  };

  const handleDarkModeToggle = async (value: boolean) => {
    setDarkMode(value);
    await settingsService.setDarkMode(value);
    // TODO: Áp dụng dark mode cho toàn app
    Alert.alert('Info', 'Dark mode will be applied in next update');
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      [
        {
          text: 'English',
          onPress: async () => {
            setLanguage('en');
            await settingsService.setLanguage('en');
          },
        },
        {
          text: 'Tiếng Việt',
          onPress: async () => {
            setLanguage('vi');
            await settingsService.setLanguage('vi');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePasswordInApp' as any);
  };

const handleLogout = () => {
  Alert.alert(
    'Logout',
    'Are you sure you want to logout?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await userService.logout();
        },
      },
    ]
  );
};

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            navigation.navigate('DeleteAccount' as any);
          },
        },
      ]
    );
  };

  const handlePermissions = () => {
    navigation.navigate('PermissionsScreen' as any);
  };

  const handleAbout = () => {
    navigation.navigate('AboutScreen' as any);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2260FF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.title}>Settings</Text>

        {/* Profile Section */}
        {profile && (
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {profile.full_name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.full_name}</Text>
              <Text style={styles.profileEmail}>{profile.email}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProfile' as any)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.item} onPress={handleChangePassword}>
            <Text style={styles.itemText}>Change Password</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={handleLogout}>
            <Text style={styles.itemText}>Logout</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={handleDeleteAccount}>
            <Text style={[styles.itemText, styles.dangerText]}>Delete Account</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.item}>
            <Text style={styles.itemText}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: '#D1D5DB', true: '#2260FF' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity style={styles.item} onPress={handleLanguageChange}>
            <Text style={styles.itemText}>Language</Text>
            <View style={styles.languageValue}>
              <Text style={styles.valueText}>
                {language === 'en' ? 'English' : 'Tiếng Việt'}
              </Text>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>

          <TouchableOpacity style={styles.item} onPress={handlePermissions}>
            <Text style={styles.itemText}>Permissions</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.item} onPress={handleAbout}>
            <Text style={styles.itemText}>About DeepOCT</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Bold',
      android: 'LeagueSpartan-Bold',
      default: 'System',
    }),
    color: '#2260FF',
    marginTop: 20,
    marginBottom: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2260FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-SemiBold',
      android: 'LeagueSpartan-SemiBold',
      default: 'System',
    }),
    color: '#1E293B',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
      default: 'System',
    }),
    color: '#64748B',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ECF1FF',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
    color: '#2260FF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-SemiBold',
      android: 'LeagueSpartan-SemiBold',
      default: 'System',
    }),
    color: '#64748B',
    marginLeft: 16,
    marginTop: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemText: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
      default: 'System',
    }),
    color: '#1E293B',
  },
  dangerText: {
    color: '#EF4444',
  },
  arrow: {
    fontSize: 24,
    color: '#CBD5E1',
  },
  languageValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
      default: 'System',
    }),
    color: '#64748B',
    marginRight: 8,
  },
  version: {
    fontSize: 12,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
      default: 'System',
    }),
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 24,
  },
});

export default SettingScreen;