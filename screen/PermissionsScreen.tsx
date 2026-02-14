import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../App';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomDialog from '../components/dialog/CustomDialog';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface Permission {
  id: string;
  title: string;
  description: string;
  iconName: string;
  status: string;
  permission: any;
}

const PermissionsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogHasSettings, setDialogHasSettings] = useState(false);
  const [dialogType, setDialogType] = useState<'success' | 'error' | 'info'>('info');


  useEffect(() => {
    loadPermissions();
  }, []);

  const showDialog = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info',
    hasSettings: boolean = false
  ) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogType(type);
    setDialogHasSettings(hasSettings);
    setDialogVisible(true);
  };

  const handleDialogConfirm = () => {
    setDialogVisible(false);
    if (dialogHasSettings) {
      openSettings();
    }
    setDialogHasSettings(false);
  };

  const loadPermissions = async () => {
    const cameraPermission = Platform.select({
      android: PERMISSIONS.ANDROID.CAMERA,
      ios: PERMISSIONS.IOS.CAMERA,
    });

    const storagePermission = Platform.select({
      android: PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    });

    const cameraStatus = cameraPermission
      ? await check(cameraPermission)
      : RESULTS.UNAVAILABLE;
    const storageStatus = storagePermission
      ? await check(storagePermission)
      : RESULTS.UNAVAILABLE;

    setPermissions([
      {
        id: 'camera',
        title: 'Camera',
        description: 'Required to capture OCT images',
        iconName: 'camera',
        status: cameraStatus,
        permission: cameraPermission,
      },
      {
        id: 'storage',
        title: 'Photos & Media',
        description: 'Access to save and load OCT images',
        iconName: 'image',
        status: storageStatus,
        permission: storagePermission,
      },
    ]);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case RESULTS.GRANTED:
        return 'Granted';
      case RESULTS.DENIED:
        return 'Denied';
      case RESULTS.BLOCKED:
        return 'Blocked';
      case RESULTS.LIMITED:
        return 'Limited';
      default:
        return 'Not Requested';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case RESULTS.GRANTED:
        return '#22C55E';
      case RESULTS.DENIED:
      case RESULTS.BLOCKED:
        return '#EF4444';
      case RESULTS.LIMITED:
        return '#F59E0B';
      default:
        return '#94A3B8';
    }
  };

  const handlePermissionPress = async (permission: Permission) => {
    if (permission.status === RESULTS.BLOCKED) {
      showDialog(
        'Permission Blocked',
        `${permission.title} permission is blocked. Please enable it in Settings.`,
        'error',
        true
      );
      return;
    }

    if (permission.status === RESULTS.GRANTED) {
      showDialog(
        'Permission Already Granted',
        `${permission.title} permission is already enabled.`,
        'info'
      );
      return;
    }

    try {
      const result = await request(permission.permission);
      await loadPermissions();

      if (result === RESULTS.GRANTED) {
        showDialog('Success', `${permission.title} permission granted!`, 'success');
      } else if (result === RESULTS.BLOCKED) {
        showDialog(
          'Permission Blocked',
          'Please enable this permission in Settings',
          'error',
          true
        );
      }
    } catch (error) {
      showDialog('Error', 'Failed to request permission', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require('../assets/Vector_back.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Permissions</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.description}>
          DeepOCT needs these permissions to function properly. Tap on any
          permission to enable it.
        </Text>

        {permissions.map((permission) => (
          <TouchableOpacity
            key={permission.id}
            style={styles.permissionCard}
            onPress={() => handlePermissionPress(permission)}
          >
            <FontAwesome
              name={permission.iconName}
              size={32}
              color="#2260FF"
              style={{ marginRight: 12 }}
            />
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionTitle}>{permission.title}</Text>
              <Text style={styles.permissionDescription}>
                {permission.description}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(permission.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(permission.status)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => openSettings()}
        >
          <Text style={styles.settingsButtonText}>Open App Settings</Text>
        </TouchableOpacity>
      </ScrollView>

      <CustomDialog
        isVisible={dialogVisible}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={handleDialogConfirm}
        confirmText={dialogHasSettings ? 'Open Settings' : 'OK'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  backButton: { 
    padding: 8, 
    marginRight: 12 
  },
  backIcon: { 
    width: 16, 
    height: 16,
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: Platform.select({ ios: 'LeagueSpartan-SemiBold', android: 'LeagueSpartan-SemiBold' }), 
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginRight: 36,
  },
  scrollView: { 
    padding: 20,
    paddingTop: 20,
  },
  description: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
    }),
    color: '#64748B',
    marginBottom: 24,
    lineHeight: 20,
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  permissionInfo: { flex: 1 },
  permissionTitle: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-SemiBold',
      android: 'LeagueSpartan-SemiBold',
    }),
    color: '#1E293B',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 12,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
      default: 'System',
    }),
    color: '#64748B',
  },
  statusBadge: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12 
  },
  statusText: {
    fontSize: 12,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
    color: '#FFFFFF',
  },
  settingsButton: {
    backgroundColor: '#2260FF',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#2260FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
  },
});

export default PermissionsScreen;