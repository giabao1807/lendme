import React, {forwardRef, useEffect, useState} from 'react';
import {Text, View, TextInput, TouchableOpacity} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import styles from './BorrowBottomSheet.styles';
import database from '@react-native-firebase/database';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Device} from '../DeviceList/DeviceList';
import {formatDate} from '../../utils/dateUtils';

const CustomHandle = () => null;

const CustomBackdrop = (props: any) => (
  <BottomSheetBackdrop
    {...props}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
    opacity={0.4}
  />
);

const CustomBackground = () => <View style={styles.sheetBackground} />;

interface BorrowBottomSheetProps {
  device: Device | null;
  onBorrowSuccess: (device: Device) => void;
  onClose?: () => void;
}

const BorrowBottomSheet = forwardRef(
  ({device, onBorrowSuccess, onClose}: BorrowBottomSheetProps, ref: any) => {
    const [rememberName, setRememberName] = useState(true);
    const [userName, setUserName] = useState('');
    const snapPoints = ['31%'];

    useEffect(() => {
      const loadSavedName = async () => {
        const saved = await AsyncStorage.getItem('borrowerName');
        if (saved) {
          setUserName(saved);
        } else {
          setUserName('');
        }
        setRememberName(false);
      };

      loadSavedName();
    }, [device]);

    const sendNotificationToAdmins = async (
      device: Device,
      userName: string,
    ) => {
      try {
        const snapshot = await database().ref('accounts').once('value');
        const accounts = snapshot.val();

        if (!accounts) return;

        const adminTokens = Object.values(accounts)
          .filter((acc: any) => acc.role === 'admin' && acc.fcmToken)
          .map((acc: any) => acc.fcmToken);

        for (const token of adminTokens) {
          await fetch('http://10.0.2.2:3000/send-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token,
              title: 'Yêu cầu mượn thiết bị',
              body: `${userName} đã gửi yêu cầu mượn thiết bị ${device.deviceName}`,
              data: {
                deviceId: device.id,
                userName,
              },
            }),
          });
        }
      } catch (err) {
        console.error('Lỗi khi gửi thông báo đến admin:', err);
      }
    };

    const handleSubmit = async () => {
      if (!device || userName.trim() === '') return;

      try {
        const id = uuid.v4() as string;
        const now = new Date();
        const createDate = formatDate(now);

        await database()
          .ref(`users/${id}`)
          .set({
            id,
            userName,
            deviceId: device.id,
            createDate: `${createDate.datePart} ${createDate.time}`,
          });

        await database().ref(`devices/${device.id}`).update({
          status: 'pending',
        });

        if (rememberName) {
          await AsyncStorage.setItem('borrowerName', userName);
        } else {
          await AsyncStorage.removeItem('borrowerName');
        }

        await sendNotificationToAdmins(device, userName);

        onBorrowSuccess({
          ...device,
          status: 'borrowed',
          borrowerName: userName,
          borrowDate: createDate,
        });

        ref.current?.dismiss();
        onClose?.();
      } catch (error) {
        console.error('Lỗi khi xử lý yêu cầu mượn:', error);
      }
    };

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enableOverDrag={false}
        enablePanDownToClose
        handleComponent={CustomHandle}
        onChange={index => {
          if (index === -1) {
            onClose?.();
          }
        }}
        backdropComponent={CustomBackdrop}
        backgroundComponent={CustomBackground}>
        <BottomSheetView style={styles.container}>
          <View style={styles.customHandle}>
            <View style={styles.indicator} />
          </View>

          <Text style={styles.title}>Yêu cầu mượn thiết bị</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.text}>Tên người mượn</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Nhập họ và tên"
              placeholderTextColor="#87B6DE"
              value={userName}
              onChangeText={setUserName}
            />
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => {
              setRememberName(!rememberName);
            }}>
            <View
              style={[styles.checkbox, rememberName && styles.checkboxChecked]}>
              {rememberName && <Text style={styles.checkboxTick}>✓</Text>}
            </View>
            <Text style={styles.text}>Sử dụng tên này cho lần sau</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Gửi yêu cầu</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default BorrowBottomSheet;
