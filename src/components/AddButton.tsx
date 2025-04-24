import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import styles from './AddButtonStyles';

interface AddButtonProps {
  onPress?: () => void;
}

export default function AddButton({onPress}: AddButtonProps) {
  return (
    <TouchableOpacity style={styles.addButton} onPress={onPress}>
      <Image
        source={require('../assets/add.png')}
        style={styles.addIcon}
      />
    </TouchableOpacity>
  );
}
