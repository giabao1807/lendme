import React from 'react';
import {Text, View} from 'react-native';
import styles from './AddBottomSheet.styles';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

interface Props {
  deviceName: string;
  onChange: (text: string) => void;
}

const InputDevice = ({deviceName, onChange}: Props) => (
  <View style={styles.inputContainer}>
    <Text style={styles.text}>Tên thiết bị</Text>
    <BottomSheetTextInput
      style={styles.input}
      placeholder="Galaxy Z Fold 6, iPhone 16 Pro Max, ..."
      placeholderTextColor="#87B6DE"
      value={deviceName}
      onChangeText={onChange}
    />
  </View>
);

export default InputDevice;
