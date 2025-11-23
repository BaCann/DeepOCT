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
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import predictionService from '../src/services/prediction.service';
import { PredictionResult, DISEASE_INFO, DISEASE_COLORS } from '../src/types/prediction.types'; // Đã loại bỏ GradCAMAnalysis
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const PredictionDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const predictionId = route.params?.predictionId;

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);

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
      Alert.alert('Error', result.message, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#2260FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prediction Detail</Text>
        <View style={{ width: 40 }} />
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

        {/* Heatmap (if available) - Chỉ giữ lại phần hiển thị ảnh và hint */}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF1FF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-SemiBold',
      android: 'LeagueSpartan-SemiBold',
      default: 'System',
    }),
    color: '#2260FF',
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
    backgroundColor: '#ECF1FF',
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
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
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
    color: '#000000',
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
    backgroundColor: '#ECF1FF',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#2260FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    backgroundColor: '#FFFFFF',
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
    color: '#000000',
    flex: 1,
  },
  probBarContainer: {
    height: 8,
    backgroundColor: '#FFFFFF',
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
    color: '#000000',
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
    color: '#000000',
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