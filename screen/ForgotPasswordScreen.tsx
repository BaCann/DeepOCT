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
  ForgotPassword: undefined;
  OTP: { email: string };
};

const ForgotPasswordScreen = () => {
  
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'ForgotPassword'>>();
  const [email, setEmail] = useState('');
  



  const handleSendOTP = () => {
   navigation.navigate('OTP', { email }); 

  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Row: Back + Title + Placeholder */}
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
          <Text style={styles.headerTitle}>Forgot Password</Text>
        </View>

        <View style={styles.placeholder} />
      </View>



      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter Email</Text>
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

           {/* Log In Button */}
                <TouchableOpacity style={styles.otpButton} onPress={handleSendOTP}>
                  <Text style={styles.otpButtonText}>Send OTP</Text>
                </TouchableOpacity>
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
    paddingHorizontal: 30,
  },

 headerLeft: {
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  paddingLeft: 40,
  marginBottom: 40,           
},




  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 20,
  },
  backButton: {
  padding: 20,
  alignSelf: 'flex-start',
  transform: [{ translateX: 10 }],
},

  backIcon: {
    width: 16,
    height: 16,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
     paddingLeft: -20,
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
  transform: [{ translateX: -15 }], 
},


  inputContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
    color: '#000000',
    marginBottom: 8,
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


  otpButton: {
    backgroundColor: '#2260FF',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    width: 200,
     alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  otpButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
  },


});

export default ForgotPasswordScreen;
