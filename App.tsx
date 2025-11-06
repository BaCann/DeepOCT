import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, useColorScheme } from 'react-native';
import SplashScreen from './screen/SplashScreen';
import WelcomeScreen from './screen/WelcomeScreen';
import RegisterScreen from './screen/RegisterScreen';
import LoginScreen from './screen/LoginScreen';
import ForgotPasswordScreen from './screen/ForgotPasswordScreen';
import OTPScreen from './screen/OTPScreen';
import { TabBar } from './components/bottombar'; 

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTP: { email: string };
};



const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <AuthStack.Screen name="Splash" component={SplashScreen} />
    <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <AuthStack.Screen name="OTP" component={OTPScreen} />
  </AuthStack.Navigator>
);

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <RootStack.Screen name="Auth" component={AuthNavigator} />
        <RootStack.Screen 
          name="Main" 
          component={TabBar}  
          options={{
            gestureEnabled: false,
          }} 
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default App;