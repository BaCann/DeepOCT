import React from 'react';
import { Linking, TouchableOpacity, View, StyleSheet } from 'react-native';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { scale } from 'react-native-size-scaling';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Dimensions } from 'react-native';
import HomeScreen from '../../screen/HomeScreen';
import SettingScreen from '../../screen/SettingScreen';



const { width } = Dimensions.get('window');
export const TabBar = () => {
  const _renderIcon = (routeName: string, selectedTab: string) => {
    let icon = '';

    switch (routeName) {
      case 'home':
        icon = 'home';
        break;
      case 'settings':
        icon = 'setting';
        break;
    }

    return (
      <AntDesign
        name={icon}
        size={scale(25)}
        color={routeName === selectedTab ? 'white' : '#FFFFFF'}
      />
    );
  };
  const renderTabBar = ({ routeName, selectedTab, navigate }: any) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };



  return (
    <CurvedBottomBar.Navigator
      id="bottomBar"
      style={styles.bottomBar}
      height={60}
      width={width}
      circleWidth={50}
      bgColor="#2260FF"
      borderColor="#2260FF"
      borderWidth={0.5}
      initialRouteName="home"
      borderTopLeftRight
      type="DOWN"
      circlePosition="CENTER"
      backBehavior="none"
      shadowStyle={styles.bottomBar}
      screenOptions={{ headerShown: false }}
      screenListeners={{}}
      defaultScreenOptions={{}}
      renderCircle={() => (
        <TouchableOpacity
            style={styles.btnCircle}
            onPress={() => {
            // Thêm action khi ấn vào đây
            console.log('Center button pressed');
            }}
        >
            <FontAwesome name="camera" color="white" size={scale(20)} />
        </TouchableOpacity>
        )}
      tabBar={renderTabBar}
    >
      <CurvedBottomBar.Screen
        name="home"
        position="LEFT"
        component={HomeScreen}
      />
      <CurvedBottomBar.Screen
        name="settings"
        position="RIGHT"
        component={SettingScreen}
      />
    </CurvedBottomBar.Navigator>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  btnCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2260FF',
    bottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
});
