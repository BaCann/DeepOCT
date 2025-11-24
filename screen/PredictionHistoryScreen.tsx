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
  RefreshControl,
  Platform,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import predictionService from '../src/services/prediction.service';
import { PredictionHistory, DISEASE_COLORS } from '../src/types/prediction.types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomDialog from '../components/dialog/CustomDialog';

// Định nghĩa các chế độ của dialog
type DialogMode = 'error' | 'deleteSingleConfirm' | 'success'; 

const PredictionHistoryScreen = () => {
  const navigation = useNavigation<any>();

  const [history, setHistory] = useState<PredictionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 5;

  // Dialog states
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogMode, setDialogMode] = useState<DialogMode>('error');
  const [dialogShowCancel, setDialogShowCancel] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PredictionHistory | null>(null);


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

  useFocusEffect(
    useCallback(() => {
      loadHistory(currentPage);
    }, [currentPage])
  );

  // ===============================================
  // MARK: - DIALOG & DELETION LOGIC
  // ===============================================

  const executeSingleDelete = async (item: PredictionHistory) => {
    const result = await predictionService.delete(item.id);
    
    if (result.success) {
      showDialog('Success', 'Prediction deleted successfully.', 'success');
      // Tải lại lịch sử sau khi xóa
      reloadHistoryAfterDelete(1);
    } else {
      showDialog('Error', result.message || 'Failed to delete prediction.', 'error');
    }
  };
  
  const reloadHistoryAfterDelete = (deletedCount: number) => {
      const newTotalItems = totalItems - deletedCount;
      const newTotalPages = Math.ceil(newTotalItems / pageSize);
      let pageToLoad = currentPage;

      // Nếu trang hiện tại trống sau khi xóa, quay lại trang trước
      if (history.length <= deletedCount && currentPage > 1) {
          pageToLoad = currentPage - 1;
      }

      if (pageToLoad !== currentPage) {
          setCurrentPage(pageToLoad);
      } else {
          loadHistory(pageToLoad);
      }
      setTotalPages(newTotalPages);
      setTotalItems(newTotalItems);
  };

  const handleDialogConfirm = () => {
    setDialogVisible(false);
    if (dialogMode === 'deleteSingleConfirm' && itemToDelete) {
      // Thực hiện xóa sau khi xác nhận
      executeSingleDelete(itemToDelete);
      setItemToDelete(null);
    }
    // Các mode 'success' hoặc 'error' chỉ cần đóng dialog (setDialogVisible(false) đã xử lý)
  };

  const handleDelete = (item: PredictionHistory) => {
    setItemToDelete(item);
    showDialog(
      'Delete Prediction',
      'Are you sure you want to delete this prediction?',
      'deleteSingleConfirm',
      true // showCancel
    );
  };

  // ===============================================
  // MARK: - DATA LOADING
  // ===============================================

  const loadHistory = async (page: number) => {
    if (page === 1 && !refreshing) {
      setLoading(true);
    }

    const result = await predictionService.getHistory(page, pageSize);

    if (result.success && result.data) {
      setHistory(result.data);
      setCurrentPage(page);
      setTotalItems(result.total);
      setTotalPages(Math.ceil(result.total / result.page_size));
    } else {
      showDialog('Error', result.message || 'Failed to load history', 'error');
    }

    setLoading(false);
    setRefreshing(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadHistory(1);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      loadHistory(newPage);
    }
  };
  
  const handleItemPress = (item: PredictionHistory) => {
    navigation.navigate('PredictionDetail', { predictionId: item.id });
  };


  // ===============================================
  // MARK: - RENDERING
  // ===============================================

  const renderItem = ({ item }: { item: PredictionHistory }) => {
    return (
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
                { backgroundColor: DISEASE_COLORS[item.predicted_class] || '#9CA3AF' },
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
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyText}>No predictions yet</Text>
      <Text style={styles.emptyHint}>
        Start diagnosing images to see your history
      </Text>
    </View>
  );

  const renderPaginationButtons = () => {
    if (totalPages <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        {/* Previous Button */}
        <TouchableOpacity
          style={styles.pageButton}
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Icon
            name="chevron-left"
            size={24}
            color={currentPage === 1 ? '#9CA3AF' : '#2260FF'}
          />
        </TouchableOpacity>

        {/* Page Info */}
        <View style={styles.pageInfo}>
          <Text style={styles.pageText}>
            Page {currentPage} of {totalPages}
          </Text>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.pageButton}
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Icon
            name="chevron-right"
            size={24}
            color={currentPage === totalPages ? '#9CA3AF' : '#2260FF'}
          />
        </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Prediction History</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalItems}</Text>
          <Text style={styles.statLabel}>Total Predictions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{history.length}</Text>
          <Text style={styles.statLabel}>Current Page Items</Text> 
        </View>
      </View>

      {/* List */}
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderPaginationButtons}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2260FF']}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Custom Dialog */}
      <CustomDialog
        isVisible={dialogVisible}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={handleDialogConfirm}
        onCancel={() => setDialogVisible(false)}
        showCancelButton={dialogShowCancel}
        confirmText={dialogMode === 'deleteSingleConfirm' ? 'Delete' : 'OK'}
        confirmButtonColor={dialogMode === 'deleteSingleConfirm' ? '#EF4444' : '#2260FF'}
        cancelText='Cancel'
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
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Bold',
      android: 'LeagueSpartan-Bold',
      default: 'System',
    }),
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginRight: 36,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    color: '#64748B',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#ECF1FF',
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
    color: '#64748B',
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
    color: '#64748B',
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pageInfo: {
    paddingHorizontal: 12,
  },
  pageText: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
    color: '#2260FF',
  }
});

export default PredictionHistoryScreen;