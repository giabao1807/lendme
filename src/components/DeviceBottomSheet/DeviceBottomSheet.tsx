/* eslint-disable react/no-unstable-nested-components */
import React, {forwardRef, useRef} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import AddDeviceBottomSheet from '../AddBottomSheet/AddBottomSheet';
import styles from './DeviceBottomSheet.styles';
import images from '../../assets';

interface DeviceBottomSheetProps {
  onClose: () => void;
}

const DeviceBottomSheet = forwardRef<BottomSheetModal, DeviceBottomSheetProps>(
  ({onClose}, ref) => {
    const snapPoints = ['16%'];
    const addDeviceBottomSheetRef = useRef<BottomSheetModal>(null);

    const handleOpenAddDeviceBottomSheet = () => {
      if (ref && typeof ref !== 'function' && ref.current) {
        ref.current.dismiss();
      }
      addDeviceBottomSheetRef.current?.present();
    };

    return (
      <>
        {/* First BottomSheet */}
        <BottomSheetModal
          ref={ref as React.RefObject<BottomSheetModal>}
          index={0}
          snapPoints={snapPoints}
          onDismiss={onClose}
          enablePanDownToClose
          enableOverDrag={false}
          handleComponent={() => null}
          backdropComponent={props => (
            <BottomSheetBackdrop
              {...props}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              opacity={0.4}
            />
          )}
          backgroundComponent={() => <View style={styles.sheetBackground} />}>
          <BottomSheetView style={styles.contentContainer}>
            <View style={styles.customHandle}>
              <View style={styles.indicator} />
            </View>

            <Text style={styles.title}>Thiết bị</Text>

            <TouchableOpacity
              style={styles.item}
              onPress={handleOpenAddDeviceBottomSheet}>
              <Image
                source={images.deviceIcon}
                style={styles.icon}
              />
              <Text style={styles.text}>Thêm thiết bị mới</Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetModal>

        {/* Second BottomSheet */}
        <AddDeviceBottomSheet ref={addDeviceBottomSheetRef} onClose={onClose} />
      </>
    );
  },
);

export default DeviceBottomSheet;
