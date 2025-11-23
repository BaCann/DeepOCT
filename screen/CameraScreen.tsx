// src/screens/CameraScreen.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import ImagePicker from 'react-native-image-crop-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomDialog from '../components/dialog/CustomDialog';

type CameraFacing = 'front' | 'back';

const CameraScreen = () => {
  const cameraRef = useRef<RNCamera | null>(null);
  const [facing, setFacing] = useState<CameraFacing>('back');
  const [isPermitted, setIsPermitted] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const navigation = useNavigation<any>();

  // Dialog states
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogHasSettings, setDialogHasSettings] = useState(false);
  const [dialogType, setDialogType] = useState<'success' | 'error' | 'info'>('info');

  const showDialog = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info',
    hasSettings: boolean = false
  ) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogType(type);
    setDialogHasSettings(hasSettings);
    setDialogVisible(true);
  };

  const handleDialogConfirm = () => {
    setDialogVisible(false);
    // Logic mở Settings không được thêm vì Alert ban đầu không có option này
    setDialogHasSettings(false);
  };


  const requestCameraPermission = async () => {
    try {
      const permission = Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      });

      const result = await check(permission!);
      if (result === RESULTS.GRANTED) {
        setIsPermitted(true);
        return true;
      }

      const newResult = await request(permission!);
      if (newResult === RESULTS.GRANTED) {
        setIsPermitted(true);
        return true;
      } else {
        showDialog('Permission Error', 'Please allow Camera access in Settings.', 'error');
        return false;
      }
    } catch {
      return false;
    }
  };

  const requestPhotoLibraryPermission = async () => {
    const permission = Platform.select({
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      android:
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES ??
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    });

    try {
      const result = await check(permission!);
      if (result === RESULTS.GRANTED) return true;
      const newResult = await request(permission!);
      if (newResult === RESULTS.GRANTED) return true;

      showDialog('Permission Error', 'Please allow Photo Library access in Settings.', 'error');
      return false;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    requestCameraPermission();
    requestPhotoLibraryPermission();
  }, []);

  if (!isPermitted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 20, color: '#fff' }}>Camera access is required.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
          <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
        {/* Custom Dialog cũng có thể hiển thị ở đây nếu cần */}
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const data = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        base64: false,
        fixOrientation: true,
      });

      const { width, height, uri } = data;
      const side = Math.min(width, height);

      const cropped = await ImagePicker.openCropper({
        path: uri,
        width: side,
        height: side,
        mediaType: 'photo',
        cropperCircleOverlay: false,
        freeStyleCropEnabled: false,
        cropperChooseText: 'Done',
        cropperCancelText: 'Cancel',
      });

      await CameraRoll.save(cropped.path, { type: 'photo' });
      
      navigation.navigate('Tabs', {
        screen: 'home',
        params: {
          selectedImage: cropped.path,
        },
      });
      
    //  showDialog('Success', 'Photo captured! You can now diagnose it.', 'success');
    } catch (e) {
      console.log('Failed to take or crop photo:', e);
    }
  };

  const openImageLibrary = async () => {
    try {
      const granted = await requestPhotoLibraryPermission();
      if (!granted) return;
      
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        mediaType: 'photo',
      });

      navigation.navigate('Tabs', {
        screen: 'home',
        params: {
          selectedImage: image.path,
        },
      });
      
      showDialog('Success', 'Image selected! You can now diagnose it.', 'success');
    } catch (e) {
      console.log('Failed to select image:', e);
    }
  };

  const switchCamera = () => {
    if (flashOn) {
      setFlashOn(false);
    }
    setFacing(prev => (prev === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    if (facing === 'front') {
      showDialog('Notice', 'Flash is only available for the rear camera.', 'info');
      setFlashOn(false);
      return;
    }
    setFlashOn(prev => !prev);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <FontAwesome name="close" size={30} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={toggleFlash} 
          style={styles.flashButton}
          disabled={facing === 'front'}
        >
          <FontAwesome
            name="bolt"
            size={26}
            color={
              facing === 'front' 
                ? '#888' 
                : flashOn 
                  ? '#FFD700' 
                  : '#fff'
            }
          />
        </TouchableOpacity>
      </View>

      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={facing === 'back' ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
        flashMode={
          facing === 'back' && flashOn
            ? RNCamera.Constants.FlashMode.torch
            : RNCamera.Constants.FlashMode.off
        }
        captureAudio={false}
      >
        <View style={styles.overlayContainer}>
          <View style={styles.squareFrame} />
        </View>
      </RNCamera>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.iconButton} onPress={openImageLibrary}>
          <FontAwesome name="image" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={switchCamera}>
          <Icon name="flip-camera-android" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Custom Dialog */}
      <CustomDialog
        isVisible={dialogVisible}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={handleDialogConfirm}
        confirmText={'OK'}
      />
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  squareFrame: {
    width: '80%',
    aspectRatio: 1,
    borderColor: '#ffffffff',
    borderWidth: 3,
    borderRadius: 8,
  },
  topBar: {
    backgroundColor: 'black',
    height: Platform.OS === 'ios' ? 100 : 90, 
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 15,
    position: 'absolute',
    top: 0,
    zIndex: 2,
    paddingTop: Platform.OS === 'ios' ? 40 : 10, 
  },
  closeButton: {
    position: 'absolute',
    left: 15,
    top: Platform.OS === 'ios' ? 80 : 50,
  },
  flashButton: {
    position: 'absolute',
    right: 15,
    top: Platform.OS === 'ios' ? 80 : 50,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  iconButton: {
    padding: 10,
  },
  captureButton: {
    width: 75,
    height: 75,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});