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
};

export type MainStackParamList = {
  Tabs: undefined;
  CameraScreen: undefined; 
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
  </AuthStack.Navigator>
);

// ===== MAIN NAVIGATOR =====
const MainNavigator = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name="Tabs" component={TabBar} />
    <MainStack.Screen name="CameraScreen" component={CameraScreen} />
  </MainStack.Navigator>
);

// ===== ROOT APP =====
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    // THAY ĐỔI: Gắn ref vào NavigationContainer
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