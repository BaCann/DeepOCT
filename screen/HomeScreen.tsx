import React, { useRef } from 'react';
import { View, StyleSheet, Text, SafeAreaView, BackHandler, ToastAndroid } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = () => {
  const backPressRef = useRef(0);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        const now = Date.now();
        if (backPressRef.current && now - backPressRef.current < 2000) {
          // Kill app hoàn toàn
          BackHandler.exitApp(); 
          return true;
        } else {
          backPressRef.current = now;
          ToastAndroid.show('Press again to close', ToastAndroid.SHORT);
          return true;
        }
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Home Screen</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
});

export default HomeScreen;
