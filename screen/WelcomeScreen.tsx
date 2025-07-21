import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

const WelcomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Welcome'>>();

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}></Text>
      </View>

      <View style={styles.content}>
        {/* Phần trên */}
        <View style={styles.topContent}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo_bule.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appTitle}>SkinSight</Text>
          <Text style={styles.subtitle}>Dermatology Assistant</Text>
        </View>

        {/* Phần dưới */}
        <View style={styles.bottomContent}>
          <Text style={styles.description}>
            SkinSight empowers dermatologists with AI-driven skin image analysis,
            enabling precise diagnosis and{'\n'}
            exceptionally efficient treatments plans.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 120,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  headerText: {
    color: '#4a4a4a',
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Thin',
      android: 'LeagueSpartan-Thin',
      default: 'System'
    }),
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  topContent: {
    alignItems: 'center',
    paddingTop: 40,
  },
  bottomContent: {
    alignItems: 'center',
    paddingBottom: 400,
  },
  logoContainer: {
    marginBottom: -10,
    alignItems: 'center',
  },
  logo: {
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.5,
  },
  appTitle: {
    fontSize: 45,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Thin',
      android: 'LeagueSpartan-Thin',
      default: 'System'
    }),
    color: '#2260FF',
    marginBottom: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-SemiBold',
      android: 'LeagueSpartan-SemiBold',
      default: 'System'
    }),
    color: '#2260FF',
    marginBottom: 90,
    textAlign: 'center',
  },
  description: {
  fontSize: 14,
  fontFamily: Platform.select({
    ios: 'LeagueSpartan-Light',
    android: 'LeagueSpartan-Light',
    default: 'System',
  }),
  color: '#070707',
  textAlign: 'center', //căn đều 2 bên
  lineHeight: 15,       //giảm dãn dòng
  marginBottom: 20,
  paddingHorizontal: 10,
},

  buttonContainer: {
    gap: 10,
    alignItems: 'center',
  },
  loginButton: {
  backgroundColor: '#2260FF',
  height: 50, // cố định chiều cao
  paddingHorizontal: 90,
  borderRadius: 25,
  alignItems: 'center',
  justifyContent: 'center',
},

loginButtonText: {
  color: '#FFFFFF',
  fontSize: 24, // tăng kích thước chữ
  fontFamily: Platform.select({
    ios: 'LeagueSpartan-Medium',
    android: 'LeagueSpartan-Medium',
    default: 'System',
  }),
},

signUpButton: {
  backgroundColor: '#CAD6FF',
  height: 50, // giống login
  paddingHorizontal: 85,
  borderRadius: 25,
  alignItems: 'center',
  justifyContent: 'center',
},

signUpButtonText: {
  color: '#2260FF',
  fontSize: 24, // tăng kích thước chữ
  fontFamily: Platform.select({
    ios: 'LeagueSpartan-Medium',
    android: 'LeagueSpartan-Medium',
    default: 'System',
  }),
},

});

export default WelcomeScreen;