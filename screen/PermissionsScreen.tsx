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
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../App';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface Permission {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: string;
  permission: any;
}

const PermissionsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    const cameraPermission = Platform.select({
      android: PERMISSIONS.ANDROID.CAMERA,
      ios: PERMISSIONS.IOS.CAMERA,
    });

    const storagePermission = Platform.select({
      android: PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    });

    const cameraStatus = cameraPermission ? await check(cameraPermission) : RESULTS.UNAVAILABLE;
    const storageStatus = storagePermission ? await check(storagePermission) : RESULTS.UNAVAILABLE;

    setPermissions([
      {
        id: 'camera',
        title: 'Camera',
        description: 'Required to capture OCT images',
        icon: '📷',
        status: cameraStatus,
        permission: cameraPermission,
      },
      {
        id: 'storage',
        title: 'Photos & Media',
        description: 'Access to save and load OCT images',
        icon: '🖼️',
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
        return '#10B981';
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
      Alert.alert(
        'Permission Blocked',
        `${permission.title} permission is blocked. Please enable it in Settings.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => openSettings(),
          },
        ]
      );
      return;
    }

    if (permission.status === RESULTS.GRANTED) {
      Alert.alert('Permission Already Granted', `${permission.title} permission is already enabled.`);
      return;
    }

    try {
      const result = await request(permission.permission);
      await loadPermissions(); // Reload to update UI

      if (result === RESULTS.GRANTED) {
        Alert.alert('Success', `${permission.title} permission granted!`);
      } else if (result === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission Blocked',
          'Please enable this permission in Settings',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to request permission');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/Vector_back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Permissions</Text>
        </View>

        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.description}>
          DeepOCT needs these permissions to function properly. Tap on any permission to enable it.
        </Text>

        {permissions.map((permission) => (
          <TouchableOpacity
            key={permission.id}
            style={styles.permissionCard}
            onPress={() => handlePermissionPress(permission)}
          >
            <Text style={styles.permissionIcon}>{permission.icon}</Text>
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionTitle}>{permission.title}</Text>
              <Text style={styles.permissionDescription}>{permission.description}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(permission.status) },
              ]}
            >
              <Text style={styles.statusText}>{getStatusText(permission.status)}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.settingsButton} onPress={() => openSettings()}>
          <Text style={styles.settingsButtonText}>Open App Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 10,
  },
  backButton: {
    padding: 20,
    transform: [{ translateX: 10 }],
  },
  backIcon: {
    width: 16,
    height: 16,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  placeholder: {
    width: 44,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-SemiBold',
      android: 'LeagueSpartan-SemiBold',
      default: 'System',
    }),
    color: '#2260FF',
  },
  description: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
      default: 'System',
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
  permissionIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-SemiBold',
      android: 'LeagueSpartan-SemiBold',
      default: 'System',
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
    borderRadius: 12,
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