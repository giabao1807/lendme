import React, { useState, useEffect, forwardRef } from 'react';
import { View, Text, Alert } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { db } from '../../config/firebaseConfig';
import styles from './AddBottomSheet.styles';
import {
  InputDevice,
  BrandSelector,
  Checkbox,
  SubmitButton,
} from '.';

interface Brand {
  id: string;
  name: string;
}

interface AddDeviceBottomSheetProps {
  onClose: () => void;
}

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

const AddDeviceBottomSheet = forwardRef<BottomSheetModal, AddDeviceBottomSheetProps>(
  ({ onClose }, ref) => {
    //const snapPoints = ['43.5%'];

    const [deviceName, setDeviceName] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

    const toggleCheckbox = () => setIsChecked(!isChecked);

    useEffect(() => {
      const brandsRef = db.ref('brands');
      const listener = brandsRef.on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          const brandList = Object.entries(data).map(
            ([id, value]: [string, any]) => ({
              id,
              name: value.name,
            }),
          );
          setBrands(brandList);
        } else {
          setBrands([]);
        }
      });

      return () => brandsRef.off('value', listener);
    }, []);

    const handleSubmit = () => {
      const trimmedName = deviceName.trim();

      if (!trimmedName || !selectedBrand) {
        Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên thiết bị và chọn hãng.');
        return;
      }

      const devicesRef = db.ref('devices');
      devicesRef
        .orderByChild('deviceName')
        .equalTo(trimmedName)
        .once('value')
        .then(snapshot => {
          const isDuplicate = Object.values(snapshot.val() || {}).some(
            (device: any) =>
              (device.deviceName || '').toLowerCase() === trimmedName.toLowerCase(),
          );

          if (isDuplicate) {
            Alert.alert('Thiết bị đã tồn tại', 'Tên thiết bị này đã được thêm trước đó.');
          } else {
            const newId = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
            const newDeviceRef = db.ref(`devices/${newId}`);

            newDeviceRef
              .set({
                id: newId,
                deviceName: trimmedName,
                brand: selectedBrand,
              })
              .then(() => {
                setDeviceName('');
                setSelectedBrand(null);
                setIsChecked(false);

                const bottomSheetRef = ref as React.RefObject<BottomSheetModal>;
                if (!isChecked) {
                  bottomSheetRef.current?.dismiss();
                  onClose();
                }
              })
              .catch(error => {
                console.error('Lỗi khi thêm thiết bị:', error);
                Alert.alert('Lỗi', 'Không thể thêm thiết bị. Vui lòng thử lại!');
              });
          }
        });
    };

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        //snapPoints={snapPoints}
        onDismiss={onClose}
        enableOverDrag={false}
        enablePanDownToClose={true}
        handleComponent={CustomHandle}
        backdropComponent={CustomBackdrop}
        backgroundComponent={CustomBackground}
        enableContentPanningGesture={false}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        //android_keyboardInputMode="adjustPan"
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.customHandle}>
            <View style={styles.indicator} />
          </View>

          <Text style={styles.title}>Thêm thiết bị mới</Text>

          <InputDevice deviceName={deviceName} onChange={setDeviceName} />

          <BrandSelector
            brands={brands}
            selectedBrand={selectedBrand}
            onSelect={setSelectedBrand}
          />

          <Checkbox isChecked={isChecked} onToggle={toggleCheckbox} />

          <SubmitButton label="Thêm" onPress={handleSubmit} />
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default AddDeviceBottomSheet;
