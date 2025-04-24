import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import styles from './AdminStyles';

interface AdminProps {
  onPress?: () => void; // Hàm xử lý khi nhấn vào nút Admin
}

export default function Admin({onPress}: AdminProps) {
  return (
    <TouchableOpacity style={styles.adminButton} onPress={onPress}>
      <Image
        source={require('../assets/person_2.png')} 
        style={styles.adminIcon}
      />
    </TouchableOpacity>
  );
}
