import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import HomeScreen from './src/screens/home/HomeScreen';
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
              onPress: async () => {
                try {
                  const snapshot = await database()
                    .ref('accounts')
                    .once('value');
                  const accounts = snapshot.val();
                  if (!accounts) return;

                  const userTokens = Object.values(accounts)
                    .filter((acc: any) => acc.role === 'user' && acc.fcmToken)
                    .map((acc: any) => acc.fcmToken);

                  for (const token of userTokens) {
                    await fetch('http://10.0.2.2:3000/send-notification', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        token,

                        title: 'Yêu cầu bị từ chối',
                        body: 'Yêu cầu mượn thiết bị của bạn đã bị từ chối.',
                      }),
                    });
                  }
                } catch (error) {
                  console.error('Lỗi khi gửi thông báo đến user:', error);
                }
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
