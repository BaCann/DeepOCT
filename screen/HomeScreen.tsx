import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  BackHandler,
  ToastAndroid,
  ScrollView,
  Platform,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import userService from '../src/services/user.service';
import predictionService from '../src/services/prediction.service';
import { UserProfile } from '../src/types/user.types';
import { PredictionResult, DISEASE_COLORS } from '../src/types/prediction.types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomDialog from '../components/dialog/CustomDialog'; 

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();  
  const backPressRef = useRef(0);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [diagnosing, setDiagnosing] = useState(false);
  const [lastPrediction, setLastPrediction] = useState<PredictionResult | null>(null);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState<'success' | 'error'>('error');
  
  const handleViewDetail = (predictionId: string) => {
    navigation.navigate('PredictionDetail', { predictionId: predictionId });
  };
  
  const showDialog = (title: string, message: string, type: 'success' | 'error') => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogType(type);
    setDialogVisible(true);
  };

  const handleDialogConfirm = () => {
    setDialogVisible(false);
  };


  useEffect(() => {
    if (route.params?.selectedImage) {
      console.log('Received image from params:', route.params.selectedImage);
      setSelectedImage(route.params.selectedImage);
      setLastPrediction(null);
      
      navigation.setParams({ selectedImage: undefined });
    }
  }, [route.params?.selectedImage]);

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      const validateLastPrediction = async () => {
        if (lastPrediction) {
          const result = await predictionService.getDetail(lastPrediction.id);
          if (!result.success) {
            setLastPrediction(null);
          }
        }
      };
      validateLastPrediction();
    }, [lastPrediction])
  );
  
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS !== 'android') return;

      const onBackPress = () => {
        const now = Date.now();
        if (backPressRef.current && now - backPressRef.current < 2000) {
          BackHandler.exitApp();
          return true;
        } else {
          backPressRef.current = now;
          ToastAndroid.show('Press again to close', ToastAndroid.SHORT); 
          return true;
        }
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const loadProfile = async () => {
    const result = await userService.getProfile();
    if (result.success && result.data) {
      setProfile(result.data);
    }
  };

  const handleDiagnose = async () => {
    if (!selectedImage) {
      showDialog('Error', 'Please select an image first', 'error');
      return;
    }

    setDiagnosing(true);

    const result = await predictionService.predict(selectedImage);

    setDiagnosing(false);

    if (result.success && result.data) {
      setLastPrediction(result.data);
      showDialog('Success', 'Diagnosis completed!', 'success');
    } else {
      showDialog('Error', result.message, 'error');
    }
  };

  const handleViewHistory = () => {
    navigation.navigate('PredictionHistory');
  };

  const handleViewProfile = () => {
    navigation.navigate('EditProfile');
  };

  const getDiseaseColor = (disease: string) => {
    return DISEASE_COLORS[disease as keyof typeof DISEASE_COLORS] || '#9E9E9E'; 
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.profileSection} onPress={handleViewProfile}>
              {/* THAY ĐỔI - Hiển thị avatar hoặc chữ cái */}
              {profile?.avatar_url ? (
                <Image 
                  source={{ uri: profile.avatar_url }} 
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>
                    {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
              )}
              
              <View style={styles.profileInfo}>
                <Text style={styles.greetingText}>Welcome back,</Text>
                <Text style={styles.profileName} numberOfLines={1}>
                  {profile?.full_name || 'User'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.historyButton} onPress={handleViewHistory}>
            <FontAwesome name="history" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollView} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>OCT Diagnosis</Text>
          <Text style={styles.subtitle}>
            Tap camera button below to select an image
          </Text>
        </View>

        <View style={styles.imageContainer}>
          {selectedImage ? (
            <Image 
              source={{ uri: selectedImage }} 
              style={styles.image}
              resizeMode="cover"
              onError={(e) => {
                console.error('Image load error:', e.nativeEvent.error);
                showDialog('Error', 'Failed to load image', 'error');
              }}
            />
          ) : (
            <View style={styles.placeholder}>
              <FontAwesome
            name="camera"
            size={40}
            color="#888"
            style={styles.placeholderIcon}
            />
              <Text style={styles.placeholderText}>No image selected</Text>
              <Text style={styles.placeholderHint}>
                Tap the camera button below
              </Text>
            </View>
          )}
        </View>

        {selectedImage && (
          <TouchableOpacity
            style={[
              styles.diagnoseButton,
              diagnosing && styles.diagnoseButtonDisabled,
            ]}
            onPress={handleDiagnose}
            disabled={diagnosing}
          >
            {diagnosing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.diagnoseButtonText}>Diagnose</Text>
            )}
          </TouchableOpacity>
        )}

        {lastPrediction && (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Diagnosis Result</Text>
              <TouchableOpacity
                onPress={() => handleViewDetail(lastPrediction.id)} 
              >
                <Text style={styles.viewDetailLink}>View Details →</Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.resultCard,
                { borderColor: getDiseaseColor(lastPrediction.predicted_class) },
              ]}
            >
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Condition:</Text>
                <View
                  style={[
                    styles.diseaseBadge,
                    {
                      backgroundColor: getDiseaseColor(
                        lastPrediction.predicted_class
                      ),
                    },
                  ]}
                >
                  <Text style={styles.diseaseText}>
                    {lastPrediction.predicted_class}
                  </Text>
                </View>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Confidence:</Text>
                <Text style={styles.confidenceText}>
                  {(lastPrediction.confidence * 100).toFixed(1)}%
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Date:</Text>
                <Text style={styles.dateText}>
                  {new Date(lastPrediction.created_at).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        )}

        {!lastPrediction && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>How to use</Text>
            <Text style={styles.infoText}>
                1. Tap the camera button below to capture or select an image{'\n'}
                2. Wait for the image to appear on this screen{'\n'}
                3. Tap "Diagnose" to analyze the image{'\n'}
                4. View your diagnosis result
            </Text>
          </View>
        )}
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
    paddingTop: 0,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: 'transparent',  
    borderBottomWidth: 0,  
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
  },
  avatarText: {
    fontSize: 20,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Bold',
      android: 'LeagueSpartan-Bold',
      default: 'System',
    }),
    color: '#2260FF',
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  greetingText: {
    fontSize: 12,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Light',
      android: 'LeagueSpartan-Light',
      default: 'System',
    }),
    color: '#E0E7FF',  
    marginBottom: 2,
  },
  profileName: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-SemiBold',
      android: 'LeagueSpartan-SemiBold',
      default: 'System',
    }),
    color: '#FFFFFF',  
  },
  historyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',  
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
  titleSection: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-SemiBold',
      android: 'LeagueSpartan-SemiBold',
      default: 'System',
    }),
    color: '#2260FF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Light',
      android: 'LeagueSpartan-Light',
      default: 'System',
    }),
    color: '#000000',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#ECF1FF',
    shadowColor: '#2260FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  placeholderIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
      default: 'System',
    }),
    color: '#809CFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderHint: {
    fontSize: 13,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Light',
      android: 'LeagueSpartan-Light',
      default: 'System',
    }),
    color: '#B5C9FF',
    textAlign: 'center',
  },
  diagnoseButton: {
    backgroundColor: '#2260FF',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#2260FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  diagnoseButtonDisabled: {
    opacity: 0.6,
  },
  diagnoseButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
  },
  resultContainer: {
    marginBottom: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
    color: '#000000',
  },
  viewDetailLink: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
    color: '#2260FF',
  },
  resultCard: {
    backgroundColor: '#ECF1FF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    shadowColor: '#2260FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Light',
      android: 'LeagueSpartan-Light',
      default: 'System',
    }),
    color: '#000000',
  },
  diseaseBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  diseaseText: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-SemiBold',
      android: 'LeagueSpartan-SemiBold',
      default: 'System',
    }),
    color: '#FFFFFF',
  },
  confidenceText: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
      default: 'System',
    }),
    color: '#2260FF',
  },
  dateText: {
    fontSize: 13,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Light',
      android: 'LeagueSpartan-Light',
      default: 'System',
    }),
    color: '#000000',
  },
  infoCard: {
    backgroundColor: '#ECF1FF',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2260FF',
    marginBottom: 20,
    shadowColor: '#2260FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
    color: '#000000',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Light',
      android: 'LeagueSpartan-Light',
      default: 'System',
      
    }),
    color: '#000000',
    lineHeight: 22,
  },
});

export default HomeScreen;