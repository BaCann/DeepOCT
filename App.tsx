import React from 'react';
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

import { TabBar } from './components/bottombar';
import CameraScreen from './screen/CameraScreen';

// ===== TYPE DEFINITIONS =====
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
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// ===== STACKS =====
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

// ===== AUTH NAVIGATOR =====
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

// ===== MAIN NAVIGATOR =====
const MainNavigator = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name="Tabs" component={TabBar} />
    <MainStack.Screen name="CameraScreen" component={CameraScreen} />
    <MainStack.Screen name="ChangePasswordInApp" component={ChangePasswordInAppScreen} />
    <MainStack.Screen name="EditProfile" component={EditProfileScreen} />
    <MainStack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
    <MainStack.Screen name="PermissionsScreen" component={PermissionsScreen} />
    <MainStack.Screen name="AboutScreen" component={AboutScreen} />
  </MainStack.Navigator>
);

// ===== ROOT APP =====
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
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
  );
}

export default App;