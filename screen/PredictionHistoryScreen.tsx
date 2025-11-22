// src/screens/PredictionHistoryScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import predictionService from '../src/services/prediction.service';
import { PredictionHistory, DISEASE_COLORS } from '../src/types/prediction.types';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PredictionHistoryScreen = () => {
  const navigation = useNavigation<any>();

  // States
  const [history, setHistory] = useState<PredictionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 20;

  // Load history khi vào screen
  useFocusEffect(
    useCallback(() => {
      loadHistory(1);
    }, [])
  );

  const loadHistory = async (page: number) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const result = await predictionService.getHistory(page, pageSize);

    if (result.success && result.data) {
      if (page === 1) {
        // First page - replace
        setHistory(result.data);
      } else {
        // Next pages - append
        setHistory(prev => [...prev, ...result.data!]);
      }
      
      setCurrentPage(result.page);
      setTotalItems(result.total);
      setTotalPages(Math.ceil(result.total / result.page_size));
    } else {
      Alert.alert('Error', result.message);
    }

    setLoading(false);
    setLoadingMore(false);
    setRefreshing(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadHistory(1);
  };

  const handleLoadMore = () => {
    if (!loadingMore && currentPage < totalPages) {
      loadHistory(currentPage + 1);
    }
  };

  const handleItemPress = (item: PredictionHistory) => {
    navigation.navigate('PredictionDetail', { predictionId: item.id });
  };

  const handleDelete = (item: PredictionHistory) => {
    Alert.alert(
      'Delete Prediction',
      'Are you sure you want to delete this prediction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await predictionService.delete(item.id);
            if (result.success) {
              // Remove from list
              setHistory(prev => prev.filter(h => h.id !== item.id));
              setTotalItems(prev => prev - 1);
              Alert.alert('Success', 'Prediction deleted');
            } else {
              Alert.alert('Error', result.message);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: PredictionHistory }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      {/* Thumbnail */}
      <Image
        source={{ uri: item.thumbnail_url }}
        style={styles.thumbnail}
        resizeMode="cover"
      />

      {/* Info */}
      <View style={styles.historyInfo}>
        <View style={styles.historyHeader}>
          <View
            style={[
              styles.diseaseBadge,
              { backgroundColor: DISEASE_COLORS[item.predicted_class] },
            ]}
          >
            <Text style={styles.diseaseText}>{item.predicted_class}</Text>
          </View>
          <Text style={styles.confidenceText}>
            {(item.confidence * 100).toFixed(1)}%
          </Text>
        </View>

        <Text style={styles.dateText}>
          {new Date(item.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      {/* Delete button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item)}
      >
        <Icon name="delete-outline" size={24} color="#EF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyText}>No predictions yet</Text>
      <Text style={styles.emptyHint}>
        Start diagnosing images to see your history
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator color="#2260FF" />
        <Text style={styles.loadingMoreText}>Loading more...</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2260FF" />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Prediction History</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalItems}</Text>
          <Text style={styles.statLabel}>Total Predictions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentPage}</Text>
          <Text style={styles.statLabel}>Page {currentPage} of {totalPages}</Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2260FF']}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ECF1FF',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#2260FF',
    opacity: 0.2,
  },
  statValue: {
    fontSize: 28,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Bold',
      android: 'LeagueSpartan-Bold',
      default: 'System',
    }),
    color: '#2260FF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Light',
      android: 'LeagueSpartan-Light',
      default: 'System',
    }),
    color: '#000000',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#ECF1FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#2260FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  historyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  diseaseBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  diseaseText: {
    fontSize: 12,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-SemiBold',
      android: 'LeagueSpartan-SemiBold',
      default: 'System',
    }),
    color: '#FFFFFF',
  },
  confidenceText: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
    color: '#2260FF',
  },
  dateText: {
    fontSize: 12,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Light',
      android: 'LeagueSpartan-Light',
      default: 'System',
    }),
    color: '#000000',
  },
  deleteButton: {
    padding: 8,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
    color: '#2260FF',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Light',
      android: 'LeagueSpartan-Light',
      default: 'System',
    }),
    color: '#000000',
    textAlign: 'center',
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Light',
      android: 'LeagueSpartan-Light',
      default: 'System',
    }),
    color: '#2260FF',
  },
});

export default PredictionHistoryScreen;