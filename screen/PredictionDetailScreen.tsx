// src/screens/PredictionDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import predictionService from '../src/services/prediction.service';
import { PredictionResult, DISEASE_INFO, DISEASE_COLORS } from '../src/types/prediction.types';
import CustomDialog from '../components/dialog/CustomDialog';

const { width } = Dimensions.get('window');

const PredictionDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const predictionId = route.params?.predictionId;

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const showDialog = (title: string, message: string) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };

  const handleDialogConfirm = () => {
    setDialogVisible(false);
    navigation.goBack();
  };

  useEffect(() => {
    if (predictionId) {
      loadDetail();
    }
  }, [predictionId]);

  const loadDetail = async () => {
    setLoading(true);
    const result = await predictionService.getDetail(predictionId);
    
    if (result.success && result.data) {
      setPrediction(result.data);
    } else {
      showDialog('Error', result.message || 'Prediction not found');
      // handleDialogConfirm sẽ navigate back
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2260FF" />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!prediction) {
    return null;
  }

  const diseaseInfo = DISEASE_INFO[prediction.predicted_class];
  const diseaseColor = DISEASE_COLORS[prediction.predicted_class];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header với background xanh */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerContent}>
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
          <Text style={styles.headerTitle}>Details</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: prediction.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Disease Badge */}
        <View style={styles.diseaseSection}>
          <View
            style={[styles.diseaseBadgeLarge, { backgroundColor: diseaseColor }]}
          >
            <Text style={styles.diseaseTextLarge}>{prediction.predicted_class}</Text>
          </View>
          <Text style={styles.diseaseFullName}>{diseaseInfo.name}</Text>
          <Text style={styles.diseaseDescription}>{diseaseInfo.description}</Text>
          <View style={styles.severityBadge}>
            <Text style={styles.severityLabel}>Severity: </Text>
            <Text
              style={[
                styles.severityValue,
                { color: diseaseInfo.severity === 'high' ? '#EF4444' : '#F59E0B' },
              ]}
            >
              {diseaseInfo.severity.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Confidence */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Confidence</Text>
          <View style={styles.confidenceBar}>
            <View
              style={[
                styles.confidenceFill,
                {
                  width: `${prediction.confidence * 100}%`,
                  backgroundColor: diseaseColor,
                },
              ]}
            />
          </View>
          <Text style={styles.confidenceText}>
            {(prediction.confidence * 100).toFixed(2)}%
          </Text>
        </View>

        {/* Probabilities */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>All Probabilities</Text>
          {Object.entries(prediction.probabilities).map(([disease, prob]) => (
            <View key={disease} style={styles.probRow}>
              <View style={styles.probHeader}>
                <View
                  style={[
                    styles.probDot,
                    { backgroundColor: DISEASE_COLORS[disease as keyof typeof DISEASE_COLORS] },
                  ]}
                />
                <Text style={styles.probLabel}>{disease}</Text>
              </View>
              <View style={styles.probBarContainer}>
                <View
                  style={[
                    styles.probBar,
                    {
                      width: `${prob * 100}%`,
                      backgroundColor: DISEASE_COLORS[disease as keyof typeof DISEASE_COLORS],
                    },
                  ]}
                />
              </View>
              <Text style={styles.probValue}>{(prob * 100).toFixed(1)}%</Text>
            </View>
          ))}
        </View>

        {/* Heatmap (if available) */}
        {prediction.heatmap_url && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Heatmap Visualization</Text>
            <Image
              source={{ uri: prediction.heatmap_url }}
              style={styles.heatmapImage}
              resizeMode="cover"
            />
            <Text style={styles.heatmapHint}>
              Red areas indicate regions the model focused on (Grad-CAM)
            </Text>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Details</Text>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Prediction ID:</Text>
            <Text style={styles.metadataValue} numberOfLines={1}>
              {prediction.id}
            </Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Inference Time:</Text>
            <Text style={styles.metadataValue}>
              {(prediction.inference_time / 1000).toFixed(2)}s
            </Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Created:</Text>
            <Text style={styles.metadataValue}>
              {new Date(prediction.created_at).toLocaleString()}
            </Text>
          </View>
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
    backgroundColor: '#F8FAFC',
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
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Light',
      android: 'LeagueSpartan-Light',
      default: 'System',
    }),
    color: '#2260FF',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#ECF1FF',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  diseaseSection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  diseaseBadgeLarge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  diseaseTextLarge: {
    fontSize: 24,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Bold',
      android: 'LeagueSpartan-Bold',
      default: 'System',
    }),
    color: '#FFFFFF',
  },
  diseaseFullName: {
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-SemiBold',
      android: 'LeagueSpartan-SemiBold',
      default: 'System',
    }),
    color: '#2260FF',
    marginBottom: 8,
    textAlign: 'center',
  },
  diseaseDescription: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Light',
      android: 'LeagueSpartan-Light',
      default: 'System',
    }),
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityLabel: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
    color: '#64748B',
  },
  severityValue: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Bold',
      android: 'LeagueSpartan-Bold',
      default: 'System',
    }),
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-SemiBold',
      android: 'LeagueSpartan-SemiBold',
      default: 'System',
    }),
    color: '#2260FF',
    marginBottom: 16,
  },
  confidenceBar: {
    height: 32,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 16,
  },
  confidenceText: {
    fontSize: 24,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Bold',
      android: 'LeagueSpartan-Bold',
      default: 'System',
    }),
    color: '#2260FF',
    textAlign: 'center',
  },
  probRow: {
    marginBottom: 12,
  },
  probHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  probDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  probLabel: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
    color: '#1E293B',
    flex: 1,
  },
  probBarContainer: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  probBar: {
    height: '100%',
  },
  probValue: {
    fontSize: 12,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Light',
      android: 'LeagueSpartan-Light',
      default: 'System',
    }),
    color: '#2260FF',
    textAlign: 'right',
  },
  heatmapImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  heatmapHint: {
    fontSize: 12,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Light',
      android: 'LeagueSpartan-Light',
      default: 'System',
    }),
    color: '#64748B',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metadataLabel: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Light',
      android: 'LeagueSpartan-Light',
      default: 'System',
    }),
    color: '#64748B',
  },
  metadataValue: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
    color: '#2260FF',
    flex: 1,
    textAlign: 'right',
  },
});

export default PredictionDetailScreen;