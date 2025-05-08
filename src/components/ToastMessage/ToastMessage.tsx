// ToastMessage.tsx
import React from 'react';
import {View, Text} from 'react-native';
import Toast, {BaseToastProps} from 'react-native-toast-message';
import styles from './ToastMessage.styles';

const toastConfig = {
  success: ({text1}: BaseToastProps) => {
    const match = text1?.match(
      /Gửi yêu cầu trả thiết bị (.+) đến (.+) thành công/,
    );

    if (!match) {
      return (
        <View>
          <Text>{text1}</Text>
        </View>
      );
    }

    const [, deviceName, borrowerName] = match;

    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Gửi yêu cầu trả thiết bị <Text style={styles.bold}>{deviceName}</Text>{' '}
          đến <Text style={styles.bold}>{borrowerName}</Text> thành công
        </Text>
      </View>
    );
  },
};

const ToastMessage = () => <Toast config={toastConfig} />;

export default ToastMessage;

