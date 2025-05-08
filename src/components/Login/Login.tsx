import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import styles from './Login.styles';
import images from '../../assets';

interface LoginProps {
  onPress?: () => void;
}

export default function Login({onPress}: LoginProps) {
  return (
    <TouchableOpacity style={styles.loginButton} onPress={onPress}>
      <Image
        source={images.loginIcon}
        style={styles.loginIcon}
      />
    </TouchableOpacity>
  );
}
