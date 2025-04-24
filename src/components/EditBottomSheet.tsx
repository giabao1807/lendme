import React, {forwardRef, useRef} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {Device} from './DeviceList';
import styles from './EditBottomSheetStyles';
import database from '@react-native-firebase/database';

import UpdateBottomSheet from './UpdateBottomSheet';

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

interface EditBottomSheetProps {
  device: Device | null;
  onDelete: () => void;
  onRequestReturn: () => void;
  onClose?: () => void;
  onVisibilityChange?: (isVisible: boolean) => void;
  onEdit: () => void;
  onUpdateVisibilityChange?: (isVisible: boolean) => void; // NEW
}

const EditBottomSheet = forwardRef(
  (
    {
      device,
      onDelete,
      onRequestReturn,
      onClose,
      onVisibilityChange,
      onUpdateVisibilityChange, // NEW
    }: EditBottomSheetProps,
    ref: any,
  ) => {
    const updateBottomSheetRef = useRef<BottomSheetModal>(null);

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

    const handleOpenUpdateBottomSheet = () => {
      onUpdateVisibilityChange?.(true);
      updateBottomSheetRef.current?.present();
    };

    const handleUpdateBottomSheetClose = () => {
      onUpdateVisibilityChange?.(false);
      updateBottomSheetRef.current?.dismiss();
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
              onPress={handleOpenUpdateBottomSheet}>
              <Image
                source={require('../assets/edit.png')}
                style={styles.icon}
              />
              <Text style={styles.optionText}>Sửa thông tin thiết bị</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteContainer}
              onPress={handleDeleteDevice}>
              <Image
                source={require('../assets/delete.png')}
                style={styles.icon}
              />
              <Text style={styles.optionText}>Xóa thiết bị</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Yêu cầu</Text>

            <TouchableOpacity
              style={styles.requestContainer}
              onPress={onRequestReturn}>
              <Image
                source={require('../assets/send_to_mobile.png')}
                style={styles.icon}
              />
              <Text style={styles.optionText}>Gửi yêu cầu trả thiết bị</Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetModal>

        <UpdateBottomSheet
          ref={updateBottomSheetRef}
          device={device}
          onClose={handleUpdateBottomSheetClose}
        />
      </>
    );
  },
);

export default EditBottomSheet;
