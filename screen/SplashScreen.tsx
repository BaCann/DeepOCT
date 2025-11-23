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
import CustomDialog from '../components/dialog/CustomDialog'; // 👈 Import CustomDialog

// Định nghĩa Dialog Mode
type DialogMode = 'fatalError';

const delay = (ms: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};

const SplashScreen = () => {
  const navigation = useNavigation<any>();

  // Dialog states
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogMode, setDialogMode] = useState<DialogMode>('fatalError');

  // Biến cờ để theo dõi xem có nên hiển thị splash screen hay không
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
      // Khi gặp lỗi nghiêm trọng, chuyển hướng đến màn hình chào mừng/login
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
          // Token tồn tại nhưng API thất bại => Xóa token và về Login
          await StorageService.clearAll();
          navigation.replace('Login');
        }
      } catch (error) {
        // Lỗi kết nối/lỗi nghiêm trọng trong quá trình xác thực
        console.error('Auth verification failed:', error);
        
        const cachedProfile = await StorageService.getUserData();
        
        if (cachedProfile) {
          // Có dữ liệu profile cũ, cho phép vào app nhưng profile có thể lỗi
          await delay(500);
          
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main', params: { screen: 'Tabs' } }],
          });
        } else {
          // Không có cached profile => Lỗi nghiêm trọng, về Login
          await StorageService.clearAll();
          
          // Thay thế navigation.replace('Login') bằng CustomDialog
          // Show dialog cảnh báo người dùng trước khi về Login
          showDialog(
             'Connection Error', 
             'Could not verify user data. Please check your connection and try logging in again.',
          );
          // 💡 LƯU Ý: navigation.replace('Login') sẽ được gọi trong handleDialogConfirm
        }
      }
    } catch (error) {
      console.error('Splash screen general error:', error);
      // Lỗi chung của Splash Screen
      navigation.replace('Welcome');
    } finally {
        setIsReady(true); // Đánh dấu đã hoàn thành logic kiểm tra
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
        {/* Chỉ hiển thị ActivityIndicator nếu dialog không hiển thị */}
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
          // Không truyền onCancel hay showCancelButton để bắt buộc người dùng nhấn OK
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