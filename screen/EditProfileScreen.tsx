import React, { useState, useEffect } from 'react';
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
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../App';
import userService from '../src/services/user.service';
import CustomDialog from '../components/dialog/CustomDialog';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const EditProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Dialog states
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
  
  useEffect(() => {
    loadProfile();
  }, []);

  const showDialog = (title: string, message: string, type: 'success' | 'error') => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogType(type);
    setDialogVisible(true);
  };

  const handleDialogConfirm = () => {
    setDialogVisible(false);

    if (dialogType === 'success') {
      navigation.goBack();
    }
  };

  const loadProfile = async () => {
    const profile = await userService.getCachedProfile();
    if (profile) {
      setFullName(profile.full_name);
      setMobileNumber(profile.mobile_number);
      setDateOfBirth(profile.date_of_birth);
    }
    setLoading(false);
  };

  // Validate
  const validateInput = () => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    const mobileRegex = /^[0-9]+$/;
    const dateRegex = /^\d{1,4}[-/]\d{1,2}[-/]\d{2,4}$/;

    // FULL NAME
    if (!fullName.trim()) {
      showDialog('Error', 'Full name is required', 'error');
      return false;
    }
    if (!nameRegex.test(fullName.trim())) {
      showDialog('Error', 'Full name must contain only letters and spaces', 'error');
      return false;
    }

    // MOBILE NUMBER
    if (!mobileNumber.trim()) {
      showDialog('Error', 'Mobile number is required', 'error');
      return false;
    }
    if (!mobileRegex.test(mobileNumber)) {
      showDialog('Error', 'Mobile number must contain only digits', 'error');
      return false;
    }

    // DATE OF BIRTH
    if (!dateOfBirth.trim()) {
      showDialog('Error', 'Date of Birth is required', 'error');
      return false;
    }
    if (!dateRegex.test(dateOfBirth)) {
      showDialog('Error', 'Date of Birth must be a valid format (DD/MM/YYYY or YYYY-MM-DD)', 'error');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateInput()) return;

    setSaving(true);

    try {
      const result = await userService.updateProfile({
        full_name: fullName,
        mobile_number: mobileNumber,
        date_of_birth: dateOfBirth,
      });

      if (result.success) {
        showDialog('Success', 'Profile updated successfully!', 'success');
      } else {
        showDialog('Error', result.message, 'error');
      }
    } catch (error) {
      showDialog('Error', 'Failed to update profile. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2260FF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/Vector_back.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#B5C9FF"
            value={fullName}
            onChangeText={setFullName}
            editable={!saving}
            autoCapitalize="words"
          />
        </View>

        {/* Mobile Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your mobile number"
            placeholderTextColor="#B5C9FF"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
            editable={!saving}
            maxLength={15}
          />
        </View>

        {/* Date of Birth */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD or DD/MM/YYYY"
            placeholderTextColor="#B5C9FF"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            editable={!saving}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
        </TouchableOpacity>
      </ScrollView>

      {/* Dialog */}
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
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerWrapper: {
    backgroundColor: '#2260FF',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: Platform.select({ ios: 'LeagueSpartan-SemiBold', android: 'LeagueSpartan-SemiBold' }),
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginRight: 36,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 25,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontFamily: Platform.select({ ios: 'LeagueSpartan-Medium', android: 'LeagueSpartan-Medium' }),
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
  saveButton: {
    backgroundColor: '#2260FF',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    width: 200,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#2260FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
  },
});

export default EditProfileScreen;
