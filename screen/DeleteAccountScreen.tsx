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
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../App';
import userService from '../src/services/user.service';
import CustomDialog from '../components/dialog/CustomDialog';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type DialogMode = 'error' | 'finalConfirm' | 'successDelete'; 


const DeleteAccountScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogMode, setDialogMode] = useState<DialogMode>('error');
  const [dialogShowCancel, setDialogShowCancel] = useState(false);

  const showDialog = (
    title: string, 
    message: string, 
    mode: DialogMode, 
    showCancel: boolean = false
  ) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogMode(mode);
    setDialogShowCancel(showCancel);
    setDialogVisible(true);
  };

  const executeDelete = async () => {
    setLoading(true);

    try {
      const result = await userService.deleteAccount(password);

      setLoading(false); 

      if (result.success) {
        showDialog(
          'Account Deleted',
          'Your account has been permanently deleted. We are sorry to see you go.',
          'successDelete',
          false 
        );
      } else {
        showDialog('Error', result.message, 'error', false); 
      }
    } catch (error) {
      setLoading(false); 
      showDialog('Error', 'Failed to delete account. Please try again.', 'error', false);
    } 
  };


  const handleDialogConfirm = () => {
    if (dialogMode === 'finalConfirm') {
      setDialogVisible(false); 
      executeDelete(); 
    } else if (dialogMode === 'successDelete') {
      setDialogVisible(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Auth' as any }],
        })
      );
    } else {
      setDialogVisible(false); 
    }
  };


  const handleDeleteAccount = async () => {
    if (!password) {
      showDialog('Error', 'Please enter your password to confirm', 'error', false);
      return;
    }

    showDialog(
      'Final Confirmation',
      'Are you absolutely sure? This action CANNOT be undone. All your data will be permanently deleted.',
      'finalConfirm',
      true 
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={loading}>
          <Image
            source={require('../assets/Vector_back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Delete Account</Text>
        </View>

        <View style={styles.placeholder} />
      </View>
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.warningContainer}>
            <Text style={styles.warningIcon}>⚠️</Text>
          </View>

          <Text style={styles.warningTitle}>This action is permanent!</Text>
          <Text style={styles.warningText}>
            Deleting your account will:{'\n\n'}
            • Remove all your personal data{'\n'}
            • Delete all your OCT scans and results{'\n'}
            • Cancel any active subscriptions{'\n'}
            • This action CANNOT be undone
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter your password to confirm</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Password"
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

          <TouchableOpacity
            style={[styles.deleteButton, loading && styles.deleteButtonDisabled]}
            onPress={handleDeleteAccount}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.deleteButtonText}>Delete My Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomDialog
        isVisible={dialogVisible}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={handleDialogConfirm}
        onCancel={() => setDialogVisible(false)}
        showCancelButton={dialogShowCancel}
        confirmText={dialogMode === 'finalConfirm' ? 'Delete Forever' : 'OK'}
        confirmButtonColor={dialogMode === 'finalConfirm' ? '#EF4444' : '#2260FF'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 40, 
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
    }),
    color: '#EF4444',
  },
  warningContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  warningIcon: {
    fontSize: 64,
  },
  warningTitle: {
    fontSize: 24,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Bold',
      android: 'LeagueSpartan-Bold',
    }),
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  warningText: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
    }),
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
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
    width: 18,
    height: 18,
    tintColor: '#809CFF',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginTop: 30,
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
    }),
  },
  cancelButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
    }),
  },
});

export default DeleteAccountScreen;