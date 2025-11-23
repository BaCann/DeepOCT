import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';

interface CustomDialogProps {
  isVisible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void; 
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean; 
  confirmButtonColor?: string;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  isVisible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancelButton = false,
  confirmButtonColor = '#2260FF',
}) => {
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();
    }
  }, [isVisible, scaleValue]);

  const handleDismiss = (callback: () => void) => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      callback(); 
    });
  };

  const handleConfirm = () => {
    handleDismiss(onConfirm);
  };

  const handleCancel = () => {
    if (onCancel) {
      handleDismiss(onCancel);
    }
  };

  const handleBackdropPress = () => {
    if (showCancelButton && onCancel) {
      handleCancel();
    } else {
      handleConfirm();
    }
  };

  return (
    <Modal
      transparent
      visible={isVisible} 
      animationType="none"
      onRequestClose={handleBackdropPress}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <Animated.View 
              style={[
                styles.dialogContainer,
                {
                  transform: [{ scale: scaleValue }],
                  opacity: scaleValue,
                }
              ]}
            >
              {/* Tiêu đề */}
              <Text style={styles.dialogTitle}>{title}</Text>

              {/* Nội dung */}
              <Text style={styles.dialogMessage}>{message}</Text>

              {/* Các nút bấm */}
              <View style={styles.buttonContainer}>
                {showCancelButton && (
                  <TouchableOpacity 
                    style={[styles.button, styles.cancelButton]} 
                    onPress={handleCancel}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelButtonText}>{cancelText}</Text>
                  </TouchableOpacity>
                )}
                
                {/* Nút Confirm */}
                <TouchableOpacity 
                  style={[
                    styles.button, 
                    styles.confirmButton,
                    { backgroundColor: confirmButtonColor }, 
                    !showCancelButton && styles.fullWidthButton 
                  ]} 
                  onPress={handleConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#2260FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  dialogTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: '#2260FF',
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-SemiBold',
      android: 'LeagueSpartan-SemiBold',
      default: 'System',
    }),
  },
  dialogMessage: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000000',
    lineHeight: 20,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Light',
      android: 'LeagueSpartan-Light',
      default: 'System',
    }),
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  fullWidthButton: {
    flex: 1,
    marginHorizontal: 0,
    marginLeft: 0,
  },
  cancelButton: {
    backgroundColor: '#E0E7FF', 
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#2260FF',
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
  },
  confirmButton: {
    backgroundColor: '#2260FF',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
  },
});

export default CustomDialog