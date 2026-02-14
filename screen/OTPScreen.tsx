import React, { useState, useEffect, useRef } from 'react';
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
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useRoute, RouteProp } from '@react-navigation/native';
import authService from '../src/services/auth.service';
import CustomDialog from '../components/dialog/CustomDialog';

type RootStackParamList = {
  ForgotPassword: undefined;
  OTP: { email: string };
  ChangePassword: { resetToken: string };
};

const OTPScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'OTP'>>();
  const { email } = route.params;

  const [otpValue, setOtpValue] = useState('');
  const [timer, setTimer] = useState(60);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const hiddenInputRef = useRef<TextInput>(null);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
  const [resetToken, setResetToken] = useState<string | null>(null);

  useEffect(() => {
    // Focus input khi vào màn hình
    const focusTimeout = setTimeout(() => {
      hiddenInputRef.current?.focus();
    }, 300);

    // Timer countdown
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(focusTimeout);
      clearInterval(interval);
    };
  }, []);

  const formatTimer = (sec: number) => {
    const s = (sec % 60).toString().padStart(2, '0');
    return `${s}`;
  };

  const handleOtpChange = (text: string) => {
    const cleanText = text.replace(/[^0-9]/g, '').slice(0, 6);
    setOtpValue(cleanText);
  };

  // FIX: Đảm bảo focus và hiện bàn phím khi nhấn vào OTP boxes
  const handleOtpPress = () => {
    if (!loading) {
      // Dismiss keyboard trước (nếu có) rồi focus lại
      Keyboard.dismiss();
      setTimeout(() => {
        hiddenInputRef.current?.focus();
      }, 50);
    }
  };

  const showDialog = (title: string, message: string, type: 'success' | 'error', token?: string) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogType(type);
    if (token) {
      setResetToken(token);
    }
    setDialogVisible(true);
  };

  const handleDialogConfirm = () => {
    setDialogVisible(false);
    
    if (dialogType === 'success' && resetToken) {
      navigation.navigate('ChangePassword', { 
        resetToken: resetToken 
      });
    }
  };

  const handleResend = async () => {
    if (timer === 0 && !resending) {
      setResending(true);

      try {
        const result = await authService.resendOtp(email);

        if (result.success) {
          showDialog('Success', 'OTP has been resent to your email', 'success');
          setOtpValue('');
          setTimer(60);
          setTimeout(() => {
            hiddenInputRef.current?.focus();
          }, 300);
        } else {
          showDialog('Error', result.message, 'error');
        }
      } catch (error) {
        showDialog('Error', 'Failed to resend OTP. Please try again.', 'error');
      } finally {
        setResending(false);
      }
    }
  };

  const handleConfirm = async () => {
    if (otpValue.length !== 6) {
      showDialog('Error', 'Please enter all 6 digits', 'error');
      return;
    }

    setLoading(true);
    Keyboard.dismiss(); // Ẩn bàn phím khi confirm

    try {
      const result = await authService.confirmOtp(otpValue);

      if (result.success && result.resetToken) {
        showDialog('Success', 'OTP verified successfully!', 'success', result.resetToken);
      } else {
        showDialog('Error', result.message || 'Invalid OTP', 'error');
      }
    } catch (error) {
      showDialog('Error', 'Failed to verify OTP. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderOtpBoxes = () => {
    const boxes = [];
    for (let i = 0; i < 6; i++) {
      const digit = otpValue[i] || '';
      const isActive = isFocused && i === otpValue.length;

      boxes.push(
        <View
          key={i}
          style={[
            styles.otpInputWrapper,
            isActive && styles.activeOtpInput,
            digit && styles.filledOtpInput,
          ]}
        >
          <Text style={[styles.otpText, isActive && styles.activeOtpText]}>
            {digit}
          </Text>
          {isActive && <View style={styles.cursor} />}
        </View>
      );
    }
    return boxes;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/Vector_back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Enter OTP</Text>
        </View>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.subText}>
          We've sent an OTP code to your email,{'\n'}
          <Text style={{ color: '#2260FF' }}>{email}</Text>
        </Text>

        <TextInput
          ref={hiddenInputRef}
          value={otpValue}
          onChangeText={handleOtpChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.hiddenInput}
          autoFocus={true}
          caretHidden={true}
          editable={!loading}
          selectTextOnFocus={false}
        />

        <TouchableOpacity
          style={styles.otpContainer}
          onPress={handleOtpPress}
          onPressIn={handleOtpPress}
          activeOpacity={1}
          disabled={loading}
        >
          {renderOtpBoxes()}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmText}>Confirm</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          {timer === 0 ? (
            <TouchableOpacity onPress={handleResend} disabled={resending}>
              {resending ? (
                <ActivityIndicator color="#2260FF" />
              ) : (
                <Text style={styles.resendText}>Resend OTP</Text>
              )}
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Resend available in {formatTimer(timer)}s
            </Text>
          )}
        </View>
      </ScrollView>

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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 160,
    justifyContent: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 10,
  },
  backButton: {
    padding: 20,
    transform: [{ translateX: 10 }],
  },
  backIcon: {
    width: 16,
    height: 16,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  placeholder: {
    width: 44,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-SemiBold',
      android: 'LeagueSpartan-SemiBold',
      default: 'System',
    }),
    color: '#2260FF',
  },
  subText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#7D8A95',
    marginBottom: 20,
    lineHeight: 24,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
  },
  // FIX: Thay đổi hiddenInput để đảm bảo có thể focus được
  hiddenInput: {
    position: 'absolute',
    width: 0.1,
    height: 0.1,
    opacity: 0.01, // Không để 0 hoàn toàn vì có thể bị ignore
    color: 'transparent',
    // Đặt ở vị trí không nhìn thấy nhưng vẫn trong viewport
    top: 0,
    left: 0,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    gap: 6,
  },
  otpInputWrapper: {
    width: 45,
    height: 60,
    borderWidth: 2,
    borderColor: '#ECF1FF',
    borderRadius: 12,
    backgroundColor: '#ECF1FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeOtpInput: {
    borderColor: '#2260FF',
    backgroundColor: '#F8FAFF',
    shadowColor: '#2260FF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filledOtpInput: {
    borderColor: '#2260FF',
    backgroundColor: '#ECF1FF',
  },
  otpText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2260FF',
    textAlign: 'center',
  },
  activeOtpText: {
    color: '#2260FF',
  },
  cursor: {
    position: 'absolute',
    width: 2,
    height: 30,
    backgroundColor: '#2260FF',
    opacity: 1,
  },
  confirmButton: {
    backgroundColor: '#2260FF',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    width: 200,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
  },
  resendContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  resendText: {
    color: '#2260FF',
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
  },
  timerText: {
    color: '#7D8A95',
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
  },
});

export default OTPScreen;