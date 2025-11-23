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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, isValid } from 'date-fns'; // Import isValid for better date checking
import authService from '../src/services/auth.service';
import CustomDialog from '../components/dialog/CustomDialog';


type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
};

const RegisterScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Register'>>();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    
    // Nếu là thông báo thành công, chuyển sang màn Login
    if (dialogType === 'success') {
      navigation.navigate('Login');
    }
  };


  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && event.type !== 'dismissed') {
      setDate(selectedDate);
      setDob(format(selectedDate, 'dd/MM/yyyy'));
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };


  const validateInput = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{7,15}$/; 

    if (!name.trim()) {
      showDialog('Error', 'Full name is required.', 'error');
      return false;
    }
    if (!email.trim() || !emailRegex.test(email.trim())) {
      showDialog('Error', 'Please enter a valid email address.', 'error');
      return false;
    }
    if (password.length < 6) {
      showDialog('Error', 'Password must be at least 6 characters.', 'error');
      return false;
    }
    if (password !== confirmPassword) {
      showDialog('Error', 'Passwords do not match.', 'error');
      return false;
    }
    if (phone.trim() && !phoneRegex.test(phone.trim())) {
      showDialog('Error', 'Please enter a valid phone number.', 'error');
      return false;
    }
    
    if (dob) {
        try {
            const parts = dob.split('/');
            if (parts.length !== 3) {
                showDialog('Error', 'Date of Birth format must be DD/MM/YYYY.', 'error');
                return false;
            }
            const parsedDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            if (!isValid(parsedDate)) {
                 showDialog('Error', 'Date of Birth is invalid.', 'error');
                 return false;
            }
        } catch {
             showDialog('Error', 'Date of Birth format must be DD/MM/YYYY.', 'error');
             return false;
        }
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateInput()) {
      return;
    }

    setLoading(true);
    try {
      const result = await authService.register({
        email: email.trim(),
        password,
        full_name: name.trim(),
        mobile_number: phone.trim(),
        date_of_birth: dob,
      });
      console.log('Register result:', result); 

      if (result.success) {
        showDialog('Success', result.message, 'success');
      } else {
        showDialog('Register Failed', result.message, 'error');
      }
    } catch (error) {
      console.log('Register error:', error); 
      showDialog('Error', 'An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Welcome');
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
            <Image
              source={require('../assets/Vector_back.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>New Account</Text>
          </View>

          <View style={styles.placeholder} />
        </View>

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#809CFF"
            value={name}
            onChangeText={setName}
            autoCapitalize="words" // Gợi ý autoCapitalize
            editable={!loading}
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Email"
            value={email}
            placeholderTextColor="#809CFF"
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Enter your password"
              value={password}
              placeholderTextColor="#809CFF"
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
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
        </View>

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Confirm your password"
              value={confirmPassword}
              placeholderTextColor="#809CFF"
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              <Image
                source={
                  showConfirmPassword
                    ? require('../assets/Eye-open.png')
                    : require('../assets/Eye-off.png')
                      
                }
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Phone Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Phone number"
            value={phone}
            placeholderTextColor="#809CFF"
            onChangeText={setPhone}
            autoCapitalize="none"
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>


        {/* Date of birth */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity onPress={showDatepicker} disabled={loading}>
            <View style={styles.input}>
              <Text 
                style={[
                  styles.inputText, 
                  !dob && { color: '#809CFF' } 
                ]}
              >
                {dob || 'DD/MM/YYYY'}
              </Text>
            </View>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
            />
          )}
        </View>


        {/* Register Button */}
        <TouchableOpacity 
          style={[styles.registerButton, loading && styles.registerButtonDisabled]} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.registerButtonText}>Register</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
      <View style={styles.loginLinkRow}>
        <Text style={styles.signinText}>Already have an account? </Text>
        <TouchableOpacity onPress={handleSignIn} disabled={loading}>
          <Text style={styles.loginLinkText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      </ScrollView>

      {/* Custom Dialog */}
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
    paddingHorizontal: 30,
  },

  loginLinkRow: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 20,
},

signinText: {
  color: '#000000',
  fontSize: 14,
  fontFamily: Platform.select({
    ios: 'LeagueSpartan-Light',
    android: 'LeagueSpartan-Light',
    default: 'System',
  }),
},

loginLinkText: {
  color: '#2260FF',
  fontSize: 14,
  fontFamily: Platform.select({
    ios: 'LeagueSpartan-SemiBold',
    android: 'LeagueSpartan-SemiBold',
    default: 'System',
  }), 
},


  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 5,
  },
  backButton: {
    padding: 20,
    marginLeft: -15,
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

  inputContainer: {
    marginBottom: 5,
  },
  label: {
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
    color: '#000000',
    marginBottom: 5,
  },
  input: {
  height: 50,
  backgroundColor: '#ECF1FF',
  borderRadius: 10,
  paddingHorizontal: 15,
  fontSize: 16,
  color: '#2260FF', 
  fontFamily: Platform.select({
    ios: 'LeagueSpartan-Regular',
    android: 'LeagueSpartan-Regular',
    default: 'System',
  }),
},
inputText: {
  fontSize: 16,
  color: '#2260FF',
  fontFamily: Platform.select({
    ios: 'LeagueSpartan-Regular',
    android: 'LeagueSpartan-Regular',
    default: 'System',
  }),
  paddingVertical: 12,
},
placeholderText: {
  color: '#809CFF',
},
passwordContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
},
eyeButton: {
  position: 'absolute',
  right: 15,
  height: '100%',
  justifyContent: 'center',
},
eyeIcon: {
  width: 18,
  height: 18,
  tintColor: '#809CFF',
},


  registerButton: {
    backgroundColor: '#2260FF',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    width: 200,
      alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  
  loginText: {
    color: '#2260FF',
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-SemiBold',
      android: 'LeagueSpartan-SemiBold',
      default: 'System',
    }),
  },
});

export default RegisterScreen;