import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import {Alert} from 'react-native';
import {RootStackParamList} from './src/navigation/types';
import ToastMessage from './src/components/ToastMessage';
const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  useEffect(() => {
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Quyền nhận thông báo đã được cấp.');
      }
    };

    requestPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const {deviceId, userName} = remoteMessage.data || {};

      if (userName) {
        Alert.alert(
          remoteMessage.notification?.title || 'Thông báo',
          remoteMessage.notification?.body || 'Bạn có thông báo mới.',
          [
            {
              text: 'Đồng ý',
              onPress: async () => {
                if (deviceId) {
                  try {
                    await database().ref(`devices/${deviceId}`).update({
                      status: 'borrowed',
                    });
                  } catch (error) {
                    console.error(
                      'Lỗi khi cập nhật trạng thái thiết bị:',
                      error,
                    );
                  }
                }
              },
            },
            {
              text: 'Từ chối',
              style: 'cancel',
              onPress: () => {
                console.log('Admin từ chối yêu cầu.');
              },
            },
          ],
          {cancelable: true},
        );
      } else {
        Alert.alert(
          remoteMessage.notification?.title || 'Thông báo',
          remoteMessage.notification?.body || 'Bạn có thông báo mới.',
        );
      }
    });

    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
          <ToastMessage />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
