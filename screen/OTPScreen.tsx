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
  Keyboard,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useRoute, RouteProp } from '@react-navigation/native';





type RootStackParamList = {
  ForgotPassword: undefined;
  OTP: { email: string }; 
};


const OTPScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'ForgotPassword'>>();
const route = useRoute<RouteProp<RootStackParamList, 'OTP'>>();
const { email } = route.params;
  const [otpValue, setOtpValue] = useState('');
  const [timer, setTimer] = useState(60);
  const [isFocused, setIsFocused] = useState(false);
  const hiddenInputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Auto focus when screen loads
    setTimeout(() => {
      hiddenInputRef.current?.focus();
    }, 100);

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${s}`;
  };

  const handleOtpChange = (text: string) => {
    // Only allow digits and max 6 characters
    const cleanText = text.replace(/[^0-9]/g, '').slice(0, 6);
    setOtpValue(cleanText);
  };

  const handleOtpPress = () => {
    hiddenInputRef.current?.focus();
  };

  const handleResend = () => {
    if (timer === 0) {
      setOtpValue('');
      setTimer(60);
      setTimeout(() => {
        hiddenInputRef.current?.focus();
      }, 100);
      // Call resend API here if needed
      console.log('Resending OTP...');
    }
  };

  const handleConfirm = () => {
    if (otpValue.length === 6) {
      console.log('Confirm OTP:', otpValue);
      // Send OTP to server here
    } else {
      Alert.alert('Error', 'Please enter all 6 digits');
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
            digit && styles.filledOtpInput
          ]}
        >
          <Text style={[
            styles.otpText,
            isActive && styles.activeOtpText
          ]}>
            {digit}
          </Text>
          {isActive && (
            <View style={styles.cursor} />
          )}
        </View>
      );
    }
    return boxes;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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

      <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
        <Text style={styles.subText}>
  We’ve sent an OTP code to your email,{"\n"}
  <Text style={{ color: '#2260FF' }}>{email}</Text>
</Text>


        {/* Hidden TextInput for handling input */}
        <TextInput
          ref={hiddenInputRef}
          value={otpValue}
          onChangeText={handleOtpChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.hiddenInput}
          autoFocus
          caretHidden
        />

        {/* OTP Display Boxes */}
        <TouchableOpacity
          style={styles.otpContainer}
          onPress={handleOtpPress}
          activeOpacity={1}
        >
          {renderOtpBoxes()}
        </TouchableOpacity>

        {/* Confirm Button */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>

        {/* Resend timer */}
        <View style={styles.resendContainer}>
          {timer === 0 ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>Resend available in {formatTimer(timer)}s</Text>
          )}
        </View>
      </ScrollView>
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
  // Header
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
  hiddenInput: {
    position: 'absolute',
    left: -1000,
    opacity: 0,
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