// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, useColorScheme } from 'react-native';

// Auth screens
import SplashScreen from './screen/SplashScreen';
import WelcomeScreen from './screen/WelcomeScreen';
import RegisterScreen from './screen/RegisterScreen';
import LoginScreen from './screen/LoginScreen';
import ForgotPasswordScreen from './screen/ForgotPasswordScreen';
import OTPScreen from './screen/OTPScreen';
import ChangePasswordScreen from './screen/ChangePasswordScreen';

// Settings screens
import ChangePasswordInAppScreen from './screen/ChangePasswordInAppScreen';
import EditProfileScreen from './screen/EditProfileScreen';
import DeleteAccountScreen from './screen/DeleteAccountScreen';
import PermissionsScreen from './screen/PermissionsScreen';
import AboutScreen from './screen/AboutScreen';

// Prediction screens
import PredictionHistoryScreen from './screen/PredictionHistoryScreen';
import PredictionDetailScreen from './screen/PredictionDetailScreen';

import { TabBar } from './components/bottombar';
import CameraScreen from './screen/CameraScreen';
import { authEvents, AUTH_EVENTS } from './src/utils/eventEmitter';

// Import CustomDialog component
import CustomDialog from './components/dialog/CustomDialog'; 

// ===== TYPE DEFINITIONS (Unchanged) =====
export type RootStackParamList = {
  Auth: undefined;
  Main: { screen: keyof MainStackParamList };
};

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTP: { email: string };
  ChangePassword: { resetToken: string };
};

export type MainStackParamList = {
  Tabs: undefined;
  CameraScreen: undefined;
  ChangePasswordInApp: undefined;
  EditProfile: undefined;
  DeleteAccount: undefined;
  PermissionsScreen: undefined;
  AboutScreen: undefined;
  PredictionHistory: undefined;
  PredictionDetail: { predictionId: string };
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// ===== STACKS (Unchanged) =====
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

// ===== AUTH NAVIGATOR (Unchanged) =====
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Splash" component={SplashScreen} />
    <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <AuthStack.Screen name="OTP" component={OTPScreen} />
    <AuthStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
  </AuthStack.Navigator>
);

// ===== MAIN NAVIGATOR (Unchanged) =====
const MainNavigator = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name="Tabs" component={TabBar} />
    <MainStack.Screen name="CameraScreen" component={CameraScreen} />
    <MainStack.Screen name="ChangePasswordInApp" component={ChangePasswordInAppScreen} />
    <MainStack.Screen name="EditProfile" component={EditProfileScreen} />
    <MainStack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
    <MainStack.Screen name="PermissionsScreen" component={PermissionsScreen} />
    <MainStack.Screen name="AboutScreen" component={AboutScreen} />
    <MainStack.Screen name="PredictionHistory" component={PredictionHistoryScreen} />
    <MainStack.Screen name="PredictionDetail" component={PredictionDetailScreen} />
  </MainStack.Navigator>
);

// ===== ROOT APP (Modified) =====
function App() {
  const isDarkMode = useColorScheme() === 'dark';


  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
  });


  const showDialog = (title: string, message: string, onConfirm: () => void) => {
    setDialogContent({ title, message, onConfirm });
    setDialogVisible(true);
  };


  const hideDialog = () => {
    setDialogVisible(false);
  };

  useEffect(() => {
    const handleTokenExpired = () => {
      if (navigationRef.isReady()) {
        navigationRef.reset({
          index: 0,
          routes: [
            {
              name: 'Auth',
              state: {
                index: 0,
                routes: [{ name: 'Login' }],
              },
            },
          ],
        });

        showDialog(
          'Session Expired',
          'Your login session has expired. Please log in again to continue using the application.',
          () => hideDialog() 
        );
      }
    };

    const handleLogout = () => {
      if (navigationRef.isReady()) {
        navigationRef.reset({
          index: 0,
          routes: [
            {
              name: 'Auth',
              state: {
                index: 0,
                routes: [{ name: 'Login' }],
              },
            },
          ],
        });
      }
    };

    // Subscribe to events
    authEvents.on(AUTH_EVENTS.TOKEN_EXPIRED, handleTokenExpired);
    authEvents.on(AUTH_EVENTS.LOGOUT, handleLogout);

    // Cleanup
    return () => {
      authEvents.off(AUTH_EVENTS.TOKEN_EXPIRED, handleTokenExpired);
      authEvents.off(AUTH_EVENTS.LOGOUT, handleLogout);
    };
  }, []);

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Auth" component={AuthNavigator} />
          <RootStack.Screen
            name="Main"
            component={MainNavigator}
            options={{
              gestureEnabled: false,
            }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
      
      {/* Custom Dialog Component */}
      <CustomDialog
        isVisible={dialogVisible}
        title={dialogContent.title}
        message={dialogContent.message}
        onConfirm={dialogContent.onConfirm}
        confirmText="OK"
        showCancelButton={false} 
      />
    </>
  );
}

export default App;