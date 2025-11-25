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

export interface DialogOption {
  text: string;
  onPress: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomDialogProps {
  isVisible: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean; 
  confirmButtonColor?: string;

  // OPTIONS MODE
  options?: DialogOption[];
  onClose?: () => void;
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
  options,
  onClose,
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
    } else {
      scaleValue.setValue(0);
    }
  }, [isVisible]);

  const handleDismiss = (callback?: () => void) => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (callback) callback();
      else if (onClose) onClose();
    });
  };

  const handleConfirm = () => {
    if (onConfirm) handleDismiss(onConfirm);
  };

  const handleCancel = () => {
    if (onCancel) handleDismiss(onCancel);
  };

  const handleBackdropPress = () => {
    if (options) {
      const cancelOption = options.find(opt => opt.style === 'cancel');
      if (cancelOption) return handleDismiss(cancelOption.onPress);
      return handleDismiss(onClose);
    }

    if (showCancelButton && onCancel) return handleCancel();
    if (onConfirm) return handleConfirm();
  };

  const renderOptions = () => {
    const cancelOption = options?.find(opt => opt.style === 'cancel');
    const otherOptions = options?.filter(opt => opt.style !== 'cancel');

    return (
      <>
        {title ? <Text style={styles.dialogTitle}>{title}</Text> : null}
        {message ? <Text style={styles.dialogMessage}>{message}</Text> : null}

        <View style={styles.optionsVerticalContainer}>
          {otherOptions?.map((option, index) => {
            const isLast = index === otherOptions.length - 1;

            return (
              <TouchableOpacity
                key={option.text}
                style={[
                  styles.optionButton,
                  isLast && styles.lastOptionButton
                ]}
                onPress={() => handleDismiss(option.onPress)}
                activeOpacity={0.8}
              >
                <Text style={styles.optionButtonText}>{option.text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {cancelOption && (
          <TouchableOpacity
            style={styles.cancelOptionButton}
            onPress={() => handleDismiss(cancelOption.onPress)}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>{cancelOption.text}</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  // OPTIONS MODE (upload avatar)
  if (options) {
    return (
      <Modal transparent visible={isVisible} animationType="none">
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={styles.backdrop}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.dialogContainer,
                  { transform: [{ scale: scaleValue }], opacity: scaleValue }
                ]}
              >
                {renderOptions()}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  // NORMAL CONFIRM DIALOG
  return (
    <Modal transparent visible={isVisible} animationType="none">
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.dialogContainer,
                { transform: [{ scale: scaleValue }], opacity: scaleValue }
              ]}
            >
              <Text style={styles.dialogTitle}>{title}</Text>
              <Text style={styles.dialogMessage}>{message}</Text>

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

  confirmButton: { backgroundColor: '#2260FF' },

  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
  },


  optionsVerticalContainer: {
    width: '100%',
    marginTop: 10,
  },

  optionButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2260FF',
    marginBottom: 10,
  },

  optionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
  },

  lastOptionButton: { marginBottom: 0 },

  cancelOptionButton: {
    marginTop: 15,
    width: '100%',
    backgroundColor: '#E0E7FF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomDialog;
