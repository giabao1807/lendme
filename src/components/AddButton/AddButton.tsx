import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import styles from './AddButtonStyles';
import images from '../../assets';

interface AddButtonProps {
  onPress?: () => void;
}

export default function AddButton({onPress}: AddButtonProps) {
  return (
    <TouchableOpacity style={styles.addButton} onPress={onPress}>
      <Image
        source={images.addIcon}
        style={styles.addIcon}
      />
    </TouchableOpacity>
  );
}
