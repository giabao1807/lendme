import React, {useState} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import database from '@react-native-firebase/database';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import styles from './RegisterScreen.styles';

type RootStackParamList = {
  Register: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

export default function RegisterScreen({
  navigation,
}: {
  navigation: RegisterScreenNavigationProp;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      const snapshot = await database().ref(`/accounts/${username}`).once('value');

      if (snapshot.exists()) {
        Alert.alert('Tên đăng nhập đã tồn tại!');
        return;
      }

      const role = username.toLowerCase().includes('admin') ? 'admin' : 'user';

      await database().ref(`/accounts/${username}`).set({
        username,
        password,
        role,
      });

      Alert.alert('Đăng ký thành công!');
      navigation.goBack();
    } catch (error) {
      console.error('Đăng ký thất bại:', error);
      Alert.alert('Đăng ký thất bại. Vui lòng thử lại!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Ký</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Tạo Tài Khoản</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

