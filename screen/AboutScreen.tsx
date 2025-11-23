import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const AboutScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/Vector_back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>About</Text>
        </View>

        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo_bule.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* App Name */}
        <Text style={styles.appName}>DeepOCT</Text>
        <Text style={styles.tagline}>OCT Diagnosis Assistant</Text>
        <Text style={styles.version}>Version 1.0.0</Text>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.description}>
            DeepOCT uses advanced artificial intelligence to analyze Optical Coherence Tomography
            (OCT) images, providing ophthalmologists with accurate diagnostic support.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔬</Text>
            <Text style={styles.featureText}>AI-powered OCT image analysis</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureText}>Detailed diagnostic reports</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💾</Text>
            <Text style={styles.featureText}>Secure data storage</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureText}>Easy-to-use interface</Text>
          </View>
        </View>

        {/* Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Development Team</Text>
          <Text style={styles.teamText}>
            Duong Ba Can - 22520143{"\n"} 
            Nguyen Vo Dai Duong - 22520308{"\n"}
            Faculty of Computer Networks and Communications,{"\n"}
            University of Information Technology - VNU-HCM
          </Text>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => handleLinkPress('https://website.com')}
          >
            <Text style={styles.linkText}>🌐 Visit Our Website</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => handleLinkPress('https://website.com/privacy')}
          >
            <Text style={styles.linkText}>🔒 Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => handleLinkPress('https://website.com/terms')}
          >
            <Text style={styles.linkText}>📄 Terms of Service</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => handleLinkPress('mailto:noreply.deepoct@gmail.com')}
          >
            <Text style={styles.linkText}>📧 Contact Support</Text>
          </TouchableOpacity>
        </View>

        {/* Copyright */}
        <Text style={styles.copyright}>© 2025 DeepOCT. All rights reserved.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    padding: 20,
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
      default: 'System',
    }),
    color: '#2260FF',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  logo: {
    width: 120,
    height: 120,
  },
  appName: {
    fontSize: 32,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Bold',
      android: 'LeagueSpartan-Bold',
      default: 'System',
    }),
    color: '#2260FF',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
    color: '#2260FF',
    textAlign: 'center',
    marginTop: 4,
  },
  version: {
    fontSize: 12,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
      default: 'System',
    }),
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  description: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
      default: 'System',
    }),
    color: '#64748B',
    lineHeight: 22,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-SemiBold',
      android: 'LeagueSpartan-SemiBold',
      default: 'System',
    }),
    color: '#1E293B',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
      default: 'System',
    }),
    color: '#64748B',
  },
  teamText: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
      default: 'System',
    }),
    color: '#64748B',
    lineHeight: 22,
  },
  linkButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  linkText: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
    color: '#2260FF',
  },
  copyright: {
    fontSize: 12,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
      default: 'System',
    }),
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 24,
  },
});

export default AboutScreen;