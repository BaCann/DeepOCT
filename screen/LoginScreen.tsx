// src/screens/LoginScreen.tsx
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
  ActivityIndicator,
  // THÊM: KeyboardAvoidingView
  KeyboardAvoidingView, 
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList, RootStackParamList } from '../App';
import authService from '../src/services/auth.service';
import CustomDialog from '../components/dialog/CustomDialog';

type LoginNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamList, 'Login'>,
  StackNavigationProp<RootStackParamList>
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dialog states
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');

  const showDialog = (title: string, message: string, type: 'success' | 'error') => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogType(type);
    setDialogVisible(true);
  };

  const handleDialogConfirm = () => {
    setDialogVisible(false);

    if (dialogType === 'success') {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        })
      );
    }
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      const result = await authService.login({
        email: email.trim(),
        password: password,
      });

      if (result.success) {
        showDialog('Success', result.message, 'success');
      } else {
        showDialog('Login Failed', result.message, 'error');
      }
    } catch (error) {
      showDialog('Error', 'An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  const handleForgetPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header và back button nằm ngoài ScrollView */}
      <View style={styles.headerRow}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../assets/Vector_back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Login</Text>
        </View>

        <View style={styles.placeholder} />
      </View>

      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>Welcome!</Text>
      </View>
      
      {/* Bọc ScrollView bằng KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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
              editable={!loading}
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
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Image
                  source={
                    showPassword
                      ? require('../assets/Eye-open.png') 
                      : require('../assets/Eye-off.png')
                  }
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleForgetPassword} style={styles.forgetPasswordBtn}>
              <Text style={styles.forgetPasswordText}>Forgot Password ?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Log In</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Kết thúc KeyboardAvoidingView */}

      <CustomDialog
        isVisible={dialogVisible}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={handleDialogConfirm}
        confirmText="OK"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  // THÊM: Style cho KeyboardAvoidingView để nó chiếm phần còn lại của màn hình
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: { 
    flexGrow: 1, 
    paddingHorizontal: 30,
    // THÊM: Padding dưới để tạo khoảng trống khi bàn phím mở
    paddingBottom: 20, 
  },
  headerLeft: { 
    alignItems: 'flex-start', 
    paddingLeft: 40, 
    marginBottom: 40 
  },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginTop: 40, 
    marginBottom: 10 
  },
  backButton: { 
    padding: 20, 
    transform: [{ translateX: 10 }] 
  },
  backIcon: { 
    width: 16, 
    height: 16 
  },
  headerCenter: { 
    flex: 1, 
    alignItems: 'center' 
  },
  placeholder: { 
    width: 44 
  },
  headerTitle: { 
    fontSize: 28, 
    fontFamily: Platform.select({ ios: 'LeagueSpartan-SemiBold', android: 'LeagueSpartan-SemiBold' }), 
    color: '#2260FF', 
    transform: [{ translateX: -15 }] 
  },
  inputContainer: { 
    marginBottom: 10 
  },
  label: { 
    fontSize: 18, 
    fontFamily: Platform.select({ ios: 'LeagueSpartan-Medium', android: 'LeagueSpartan-Medium' }), 
    color: '#000000', 
    marginBottom: 8 
  },
  input: { 
    height: 50, 
    backgroundColor: '#ECF1FF', 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    fontSize: 16, 
    color: '#2260FF' 
  },
  passwordRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  eyeButton: { 
    padding: 8, 
    marginLeft: -36, 
    zIndex: 1 
  },
  eyeIcon: { 
    width: 18, 
    height: 18, 
    tintColor: '#809CFF' 
  },
  forgetPasswordBtn: { 
    alignSelf: 'flex-end', 
    marginTop: 6 
  },
  forgetPasswordText: { 
    color: '#2260FF', 
     fontFamily: Platform.select({ ios: 'LeagueSpartan-SemiBold', android: 'LeagueSpartan-SemiBold' }), 
    fontSize: 14 
  },
  loginButton: { 
    backgroundColor: '#2260FF', 
    height: 50, 
    borderRadius: 25, 
    alignItems: 'center', 
    width: 200, 
    alignSelf: 'center', 
    justifyContent: 'center', 
    marginTop: 10 
  },
  loginButtonDisabled: { 
    opacity: 0.6 
  },
  loginButtonText: { 
    color: '#FFFFFF', 
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
    }),
    fontSize: 18 
  },
  signupRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 8 
  },
  signupText: { 
    color: '#000000', 
    fontFamily: Platform.select({ ios: 'LeagueSpartan-Light', android: 'LeagueSpartan-Light' }), 
    fontSize: 14 
  },
  signupLink: { 
    color: '#2260FF', 
    fontFamily: Platform.select({ ios: 'LeagueSpartan-SemiBold', android: 'LeagueSpartan-SemiBold' }), 
    fontSize: 14 
  },
});

export default LoginScreen;