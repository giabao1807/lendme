import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { db } from '../../config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import styles from './LoginScreen.styles';

type RootStackParamList = {
  Register: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export default function LoginScreen({
  navigation,
}: {
  navigation: LoginScreenNavigationProp;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const prevUsername = await AsyncStorage.getItem('loggedInUser');
      if (prevUsername) {
        await db.ref(`/accounts/${prevUsername}`).update({ fcmToken: '' });
        await AsyncStorage.clear();
      }

      const snapshot = await db.ref(`/accounts/${username}`).once('value');
      if (!snapshot.exists()) {
        Alert.alert('Tài khoản không tồn tại!');
        return;
      }

      const userData = snapshot.val();
      if (userData?.password !== password) {
        Alert.alert('Sai mật khẩu!');
        return;
      }

      await messaging().deleteToken();
      const fcmToken = await messaging().getToken();

      await db.ref(`/accounts/${username}`).update({ fcmToken });

      await AsyncStorage.setItem('loggedInUser', username);
      await AsyncStorage.setItem('userRole', userData.role);

      console.log('Đăng nhập thành công. Token:', fcmToken);
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
      Alert.alert('Đăng nhập thất bại. Vui lòng thử lại!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        placeholderTextColor={'rgba(0,0,0,0.7)'}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor={'rgba(0,0,0,0.7)'}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>

      <View style={styles.linksContainer}>
        <View style={styles.registerRow}>
          <Text style={styles.text}>Bạn chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Đăng ký tài khoản</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity>
        <Text style={styles.linkText}>Quên mật khẩu?</Text>
      </TouchableOpacity>
    </View>
  );
}

