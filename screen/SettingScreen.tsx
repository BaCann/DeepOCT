import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../App'; // import kiểu MainStackParamList

type SettingScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'Tabs'
>;

type Props = {
  navigation: SettingScreenNavigationProp;
};

const SettingScreen: React.FC<Props> = ({ navigation }) => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [language, setLanguage] = React.useState('en');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Settings</Text>

        {/* Đổi mật khẩu */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // TODO: navigation tới màn hình đổi mật khẩu
            // navigation.navigate('ChangePasswordScreen');
          }}
        >
          <Text style={styles.buttonText}>Đổi mật khẩu</Text>
        </TouchableOpacity>

        {/* Đăng xuất */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // TODO: logic logout
          }}
        >
          <Text style={styles.buttonText}>Đăng xuất</Text>
        </TouchableOpacity>

        {/* Xoá tài khoản */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // TODO: logic delete account
          }}
        >
          <Text style={styles.buttonText}>Xoá tài khoản</Text>
        </TouchableOpacity>

        {/* Chế độ tối / sáng */}
        <View style={styles.row}>
          <Text style={styles.label}>Chế độ tối / sáng</Text>
          <Switch
            value={darkMode}
            onValueChange={(val) => {
              setDarkMode(val);
              // TODO: logic bật/tắt dark mode app-wide
            }}
          />
        </View>

        {/* Ngôn ngữ */}
        <View style={styles.row}>
          <Text style={styles.label}>Ngôn ngữ</Text>
          <TouchableOpacity
            onPress={() => {
              // TODO: mở modal hoặc picker chọn ngôn ngữ
            }}
          >
            <Text style={styles.buttonText}>{language === 'en' ? 'English' : 'Tiếng Việt'}</Text>
          </TouchableOpacity>
        </View>

        {/* Quyền truy cập dữ liệu */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // TODO: mở màn hình quản lý quyền truy cập (camera, vị trí, micro)
          }}
        >
          <Text style={styles.buttonText}>Quyền truy cập dữ liệu</Text>
        </TouchableOpacity>

        {/* Giới thiệu app */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // TODO: mở màn hình About (phiên bản, tác giả, website)
          }}
        >
          <Text style={styles.buttonText}>Giới thiệu app</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 20 },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: { fontSize: 16, color: '#1e293b' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },
  label: { fontSize: 16, color: '#1e293b' },
});

export default SettingScreen;
