import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
};

const SplashScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Splash'>>();

  useEffect(() => {
    const enableAutoNavigate = false
    if (enableAutoNavigate) {
      setTimeout(() => {
        navigation.navigate('Login');
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
});

export default SplashScreen;
