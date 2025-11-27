import * as React from 'react';
import { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  Dimensions, 
  Text, 
  Platform, 
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StorageService from '../src/utils/storage';
import userService from '../src/services/user.service';
import CustomDialog from '../components/dialog/CustomDialog';

type DialogMode = 'fatalError';

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const SplashScreen = () => {
  const navigation = useNavigation<any>();

  // Dialog states
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogMode, setDialogMode] = useState<DialogMode>('fatalError');

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    checkAuthAndNavigate();
  }, []);

  const showDialog = (title: string, message: string) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogMode('fatalError');
    setDialogVisible(true);
  };
  
  const handleDialogConfirm = () => {
    setDialogVisible(false);
    navigation.replace('Welcome'); 
  };

  const checkAuthAndNavigate = async () => {
    try {
      const minSplashTime = delay(2000);
      const hasToken = await StorageService.isAuthenticated();

      if (!hasToken) {
        await minSplashTime;
        navigation.replace('Welcome');
        return;
      }

      try {
        const [result] = await Promise.all([userService.getProfile(), minSplashTime]);

        if (result.success && result.data) {
          await delay(500);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main', params: { screen: 'Tabs' } }],
          });
        } else {
          await StorageService.clearAll();
          showDialog('Authentication Failed', result.message || 'Please log in again.');
        }
      } catch (error: any) {
        console.error('Auth verification failed:', error);

        const cachedProfile = await StorageService.getUserData();

        if (cachedProfile) {
          await delay(500);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main', params: { screen: 'Tabs' } }],
          });
        } else {
          await StorageService.clearAll();

          let message = 'Could not verify user data. Please check your connection and try logging in again.';
          if (error.response && error.response.data && error.response.data.detail) {
            message = error.response.data.detail;
          }

          showDialog('Authentication Error', message);
        }
      }
    } catch (error) {
      console.error('Splash screen general error:', error);
      showDialog(
        'Error',
        'An unexpected error occurred. Please try again later.'
      );
    } finally {
      setIsReady(true);
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>DeepOCT</Text>
      <Text style={styles.subtitle}>OCT Diagnosis Assistant</Text>
      
      <View style={styles.loadingContainer}>
        {!dialogVisible && <ActivityIndicator size="large" color="#FFFFFF" />}
      </View>
      
      <Text style={styles.version}>v1.0.0</Text>
      
      {/* Custom Dialog */}
      {isReady && (
        <CustomDialog
          isVisible={dialogVisible}
          title={dialogTitle}
          message={dialogMessage}
          onConfirm={handleDialogConfirm}
          confirmText="OK"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2260FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: Dimensions.get('window').width * 0.4,
    height: Dimensions.get('window').width * 0.4,
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    color: 'white',
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Bold',
      android: 'LeagueSpartan-Bold',
      default: 'System',
    }),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-SemiBold',
      android: 'LeagueSpartan-SemiBold',
      default: 'System',
    }),
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  version: {
    position: 'absolute',
    bottom: 40,
    fontSize: 12,
    color: 'white',
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
      default: 'System',
    }),
    opacity: 0.6,
  },
});

export default SplashScreen;
