import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import styles from './add-bottomsheet.styles';

interface Props {
  label: string;
  onPress: () => void;
}

const SubmitButton = ({label, onPress}: Props) => (
  <TouchableOpacity style={styles.submitButton} onPress={onPress}>
    <Text style={styles.submitButtonText}>{label}</Text>
  </TouchableOpacity>
);

export default SubmitButton;
