import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  ScrollView,
  Image,
  Alert, 
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../App';
import userService from '../src/services/user.service';
import { UserProfile } from '../src/types/user.types';
import CustomDialog, { DialogOption } from '../components/dialog/CustomDialog'; 
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';  

type SettingScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;
type DialogMode = 'info' | 'logoutConfirm' | 'deleteConfirm';

const SettingScreen = () => {
  const navigation = useNavigation<SettingScreenNavigationProp>();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogMode, setDialogMode] = useState<DialogMode>('info');
  const [dialogShowCancel, setDialogShowCancel] = useState(false);
  
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const showDialog = (
    title: string,
    message: string,
    mode: DialogMode,
    showCancel: boolean = false
  ) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogMode(mode);
    setDialogShowCancel(showCancel);
    setDialogVisible(true);
  };

  const handleDialogConfirm = async () => {
    setDialogVisible(false);

    if (dialogMode === 'logoutConfirm') {
      await userService.logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' as any }], 
      });

    } else if (dialogMode === 'deleteConfirm') {
      navigation.navigate('DeleteAccount' as any);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    setLoading(true);
    const result = await userService.getProfile();
    if (result.success && result.data) {
      setProfile(result.data);
      
      if (result.data.avatar_url) {
        setAvatarUri(result.data.avatar_url);
      }
    }
    setLoading(false);
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePasswordInApp' as any);
  };

  const handleAvatarPress = () => {
    setActionSheetVisible(true);
  };

  const handleTakePhoto = async () => {
    setActionSheetVisible(false); 
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
        includeBase64: false,
        cameraType: 'front',
      });

      if (result.assets && result.assets[0].uri) {
        await uploadAvatar(result.assets[0].uri);
      }
    } catch (error) {
      showDialog('Error', 'Failed to take photo', 'info', false);
    }
  };

  const handleChooseFromLibrary = async () => {
    setActionSheetVisible(false);
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
        includeBase64: false,
        selectionLimit: 1,
      });

      if (result.assets && result.assets[0].uri) {
        await uploadAvatar(result.assets[0].uri);
      }
    } catch (error) {
      showDialog('Error', 'Failed to select photo', 'info', false);
    }
  };
  
  const avatarOptions: DialogOption[] = [
    {
      text: 'Take Photo',
      onPress: handleTakePhoto,
      style: 'default',
    },
    {
      text: 'Choose from Library',
      onPress: handleChooseFromLibrary,
      style: 'default',
    },
    {
      text: 'Cancel',
      onPress: () => setActionSheetVisible(false),
      style: 'cancel',
    },
  ];

  const uploadAvatar = async (uri: string) => {
    setUploadingAvatar(true);
    
    try {
      const result = await userService.uploadAvatar(uri);
      
      if (result.success && result.data) {
        setProfile(result.data);
        
        setAvatarUri(result.data.avatar_url || uri);
        
        showDialog('Success', 'Profile photo updated successfully', 'info', false);
      } else {
        showDialog('Error', result.message, 'info', false);
      }
    } catch (error) {
      console.error('Upload avatar error:', error);
      showDialog('Error', 'Failed to upload photo. Please try again.', 'info', false);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = () => {
    showDialog(
      'Logout',
      'Are you sure you want to logout?',
      'logoutConfirm',
      true
    );
  };

  const handleDeleteAccount = () => {
    showDialog(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      'deleteConfirm',
      true
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
      <View style={styles.headerWrapper}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Settings</Text>
        </View>
      </View>

      <View style={styles.profileContainer}>
        {profile && (
          <View style={styles.profileSection}>
            <TouchableOpacity 
              style={styles.avatarWrapper}
              onPress={handleAvatarPress}
              activeOpacity={0.8}
              disabled={uploadingAvatar}
            >
              {avatarUri || profile.avatar_url ? (
                <Image 
                  source={{ uri: avatarUri || profile.avatar_url }} 
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>
                    {profile.full_name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              
              <View style={styles.cameraOverlay}>
                {uploadingAvatar ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <FontAwesome name="camera" size={14} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>

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
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>

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

          <TouchableOpacity style={[styles.item, styles.lastItem]} onPress={handleDeleteAccount}>
            <Text style={[styles.itemText, styles.dangerText]}>Delete Account</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>

          <TouchableOpacity style={[styles.item, styles.lastItem]} onPress={handlePermissions}>
            <Text style={styles.itemText}>Permissions</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={[styles.item, styles.lastItem]} onPress={handleAbout}>
            <Text style={styles.itemText}>About DeepOCT</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}></Text>
      </ScrollView>

      <CustomDialog
        isVisible={dialogVisible}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={handleDialogConfirm}
        onCancel={() => setDialogVisible(false)}
        showCancelButton={dialogShowCancel}
        confirmText={
          dialogMode === 'logoutConfirm' ? 'Logout' :
          dialogMode === 'deleteConfirm' ? 'Delete' : 'OK'
        }
        confirmButtonColor={
          dialogMode === 'deleteConfirm' || dialogMode === 'logoutConfirm' ? '#EF4444' : '#2260FF'
        }
        cancelText='Cancel'
      />
      
      <CustomDialog
        isVisible={actionSheetVisible}
        title="Change Profile Photo"
        message="Choose an option to change your profile picture."
        options={avatarOptions}
        onClose={() => setActionSheetVisible(false)}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 0,
  },
  headerWrapper: {
    backgroundColor: '#2260FF',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: Platform.select({ ios: 'LeagueSpartan-SemiBold', android: 'LeagueSpartan-SemiBold' }), 
    color: '#FFFFFF',
    textAlign: 'center',
  },
  profileContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#F8FAFC',
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
  avatarWrapper: {
    position: 'relative',
    width: 60,
    height: 60,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
    }),
    color: '#1E293B',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
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
  lastItem: {
    borderBottomWidth: 0,
  },
  itemText: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
    }),
    color: '#1E293B',
  },
  dangerText: {
    color: '#EF4444',
  },
  arrow: {
    fontSize: 24,
    color: '#2260FF',
  },
  version: {
    fontSize: 12,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
    }),
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 24,
  },
});

export default SettingScreen;