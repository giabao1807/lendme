import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './AddBottomSheet.styles';

interface Props {
  isChecked: boolean;
  onToggle: () => void;
}

const KeepOpenCheckbox = ({isChecked, onToggle}: Props) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={onToggle}>
    <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
      {isChecked && <Text style={styles.checkboxTick}>✓</Text>}
    </View>
    <Text style={styles.text}>Giữ khung này khi hoàn tất để tiếp tục</Text>
  </TouchableOpacity>
);

export default KeepOpenCheckbox;
