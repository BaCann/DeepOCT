import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, Text, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
};

const SplashScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Splash'>>();

const handleStart = () => {
   navigation.navigate('Welcome');
  };

  useEffect(() => {
    const enableAutoNavigate = false;
    if (enableAutoNavigate) {
      setTimeout(() => {
        navigation.navigate('Welcome');
      }, 3000);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>SkinLight</Text>
      <Text style={styles.subtitle}>Dermatology Assistant</Text>
      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.startButtonText}>Start</Text>
      </TouchableOpacity>

    </View>
    );
    
 
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2260FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: Dimensions.get('window').width * 0.4,
        height: Dimensions.get('window').width * 0.4,
        marginTop: -80,
        marginBottom: 0
    },
    title: {
        fontSize: 42,
        color: 'white',
        fontFamily: 'LeagueSpartan-Thin',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'LeagueSpartan-SemiBold',
        marginTop: 4,
        textAlign: 'center',
    },

    startButton: {
    backgroundColor: '#ffffff',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    width: 200,
     alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 160,
  },

  startButtonText: {
    color: '#2260FF',
    fontSize: 24,
    marginBottom:6 ,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
  }}
);

export default SplashScreen;
