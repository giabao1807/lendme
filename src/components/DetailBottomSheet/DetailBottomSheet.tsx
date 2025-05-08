import React, {forwardRef} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {Device} from '../DeviceList/DeviceList';
import styles from './DetailBottomSheet.styles';
import database from '@react-native-firebase/database';
import Toast from 'react-native-toast-message';
import images from '../../assets';

//import UpdateBottomSheet from './UpdateBottomSheet';

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

const sendNotificationToUsers = async (device: Device) => {
  try {
    const snapshot = await database().ref('accounts').once('value');
    const accounts = snapshot.val();

    if (!accounts) return;

    // Lọc các tài khoản có role là "user" và có fcmToken
    const userTokens = Object.values(accounts)
      .filter((acc: any) => acc.role === 'user' && acc.fcmToken)
      .map((acc: any) => acc.fcmToken);

    for (const token of userTokens) {
      await fetch('http://10.0.2.2:3000/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          title: 'Yêu cầu trả thiết bị',
          body: `Vui lòng ${device.borrowerName} trả thiết bị ${device.deviceName}`,
          data: {
            deviceId: device.id,
            deviceName: device.deviceName,
          },
        }),
      });
    }
  } catch (err) {
    console.error('Lỗi khi gửi thông báo đến user:', err);
  }
};

interface DetailBottomSheetProps {
  device: Device | null;
  onDelete: () => void;
  onRequestReturn: () => void;
  onClose?: () => void;
  onVisibilityChange?: (isVisible: boolean) => void;
  onEdit: () => void;
  onUpdateVisibilityChange?: (isVisible: boolean) => void;
}

const DetailBottomSheet = forwardRef(
  (
    {
      device,
      onDelete,
      onRequestReturn,
      onClose,
      onVisibilityChange,
      //onUpdateVisibilityChange,
      onEdit,
    }: DetailBottomSheetProps,
    ref: any,
  ) => {
    //const updateBottomSheetRef = useRef<BottomSheetModal>(null);

    if (!device) return null;

    const handleDeleteDevice = async () => {
      if (!device) return;

      try {
        await database().ref(`/devices/${device.id}`).remove();

        const userSnapshot = await database()
          .ref('/users')
          .orderByChild('deviceId')
          .equalTo(device.id)
          .once('value');

        if (userSnapshot.exists()) {
          const users = userSnapshot.val();
          const userKeys = Object.keys(users);
          for (const key of userKeys) {
            await database().ref(`/users/${key}`).remove();
          }
        }

        onDelete();
      } catch (error) {
        console.error('Lỗi khi xóa thiết bị và dữ liệu liên quan:', error);
      }
    };

    return (
      <>
        <BottomSheetModal
          ref={ref}
          index={0}
          snapPoints={['30%']}
          enableOverDrag={false}
          enablePanDownToClose
          handleComponent={CustomHandle}
          onChange={index => {
            if (index === -1) {
              onClose?.();
              onVisibilityChange?.(false);
            } else {
              onVisibilityChange?.(true);
            }
          }}
          backdropComponent={CustomBackdrop}
          backgroundComponent={CustomBackground}>
          <BottomSheetView style={styles.container}>
            <View style={styles.customHandle}>
              <View style={styles.indicator} />
            </View>

            <Text style={styles.title}>Thiết bị</Text>

            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => {
                onEdit();
              }}>
              <Image
                source={images.editIcon}
                style={styles.icon}
              />
              <Text style={styles.optionText}>Sửa thông tin thiết bị</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteContainer}
              onPress={handleDeleteDevice}>
              <Image
                source={images.deleteIcon}
                style={styles.icon}
              />
              <Text style={styles.optionText}>Xóa thiết bị</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Yêu cầu</Text>

            <TouchableOpacity
              style={styles.requestContainer}
              onPress={async () => {
                onRequestReturn();

                Toast.show({
                  type: 'success',
                  text1: `Gửi yêu cầu trả thiết bị ${device.deviceName} đến ${device.borrowerName} thành công`,
                  position: 'top',
                  visibilityTime: 5000,
                });
                if (device) {
                  await sendNotificationToUsers(device);
                }
              }}>
              <Image
                source={images.returnIcon}
                style={styles.icon}
              />
              <Text style={styles.optionText}>Gửi yêu cầu trả thiết bị</Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetModal>
      </>
    );
  },
);

export default DetailBottomSheet;
