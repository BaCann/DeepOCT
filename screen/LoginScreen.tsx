import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  // Add other screens if needed
};

const LoginScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Login'>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // TODO: Add login logic
    console.log('Login pressed');
  };

  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  const handleForgetPassword = () => {
    // TODO: Add forget password logic
    console.log('Forget Password pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@example.com"
            placeholderTextColor="#B5C9FF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="************"
              placeholderTextColor="#B5C9FF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Image
                source={
                  showPassword
                    ? require('../assets/Vector_eye.png')
                    : require('../assets/Vector_eye.png')
                }
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleForgetPassword} style={styles.forgetPasswordBtn}>
            <Text style={styles.forgetPasswordText}>Forget Password</Text>
          </TouchableOpacity>
        </View>

        {/* Log In Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        {/* Or sign up with */}
        <View style={styles.orRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>or sign up with</Text>
          <View style={styles.line} />
        </View>

        {/* Google Button */}
        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleText}>G</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'System',
      default: 'System',
    }),
  },
  input: {
    height: 48,
    backgroundColor: '#ECF1FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2260FF',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'System',
      default: 'System',
    }),
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeButton: {
    padding: 8,
    marginLeft: -36,
    zIndex: 1,
  },
  eyeIcon: {
    width: 22,
    height: 22,
    tintColor: '#809CFF',
  },
  forgetPasswordBtn: {
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  forgetPasswordText: {
    color: '#2260FF',
    fontSize: 13,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'System',
      default: 'System',
    }),
  },
  loginButton: {
    backgroundColor: '#2260FF',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'System',
      default: 'System',
    }),
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ECF1FF',
    marginHorizontal: 8,
  },
  orText: {
    color: '#B5C9FF',
    fontSize: 13,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'System',
      default: 'System',
    }),
  },
  googleButton: {
    alignSelf: 'center',
    backgroundColor: '#ECF1FF',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  googleText: {
    fontSize: 28,
    color: '#809CFF',
    fontWeight: 'bold',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signupText: {
    color: '#000',
    fontSize: 14,
  },
  signupLink: {
    color: '#2260FF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
