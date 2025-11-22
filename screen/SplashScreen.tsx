import * as React from 'react';
import { useEffect } from 'react';
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

const delay = (ms: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};

const SplashScreen = () => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    checkAuthAndNavigate();
  }, []);

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
        const [result] = await Promise.all([
          userService.getProfile(),
          minSplashTime,
        ]);
        
        if (result.success && result.data) {
          await delay(500);
          
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main', params: { screen: 'Tabs' } }],
          });
        } else {
          await StorageService.clearAll();
          navigation.replace('Login');
        }
      } catch (error) {
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
          navigation.replace('Login');
        }
      }
    } catch (error) {
      console.error('Splash screen error:', error);
      navigation.replace('Welcome');
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
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
      
      <Text style={styles.version}>v1.0.0</Text>
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