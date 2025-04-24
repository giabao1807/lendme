import React, {useEffect, useState, forwardRef} from 'react';
import {Alert, Text, View, TouchableOpacity, TextInput} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import database from '@react-native-firebase/database';
import styles from './UpdateBottomSheetStyles';

import {Device} from './DeviceList';

interface Brand {
  id: string;
  name: string;
}

interface UpdateBottomSheetProps {
  device: Device | null;
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

const UpdateBottomSheet = forwardRef<BottomSheetModal, UpdateBottomSheetProps>(
  ({device, onClose}, ref) => {
    const snapPoints = ['40%'];

    const [deviceName, setDeviceName] = useState('');
    const [brands, setBrands] = useState<Brand[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

    useEffect(() => {
      if (device) {
        setDeviceName(device.deviceName);
        setSelectedBrand(device.brand || null);
      }
    }, [device]);

    useEffect(() => {
      const brandsRef = database().ref('brands');
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
        }
      });

      return () => brandsRef.off('value', listener);
    }, []);

    const handleUpdate = async () => {
      const trimmedName = deviceName.trim();
      if (!trimmedName || !selectedBrand || !device) {
        Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên và chọn hãng.');
        return;
      }

      try {
        // Cập nhật thiết bị vào Firebase
        await database().ref(`/devices/${device.id}`).update({
          deviceName: trimmedName,
          brand: selectedBrand,
        });

        Alert.alert(
          'Cập nhật thành công',
          'Thông tin thiết bị đã được cập nhật.',
        );
        (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
        onClose(); // Đảm bảo sẽ làm mới UI khi đóng BottomSheet
      } catch (error) {
        console.error('Lỗi khi cập nhật thiết bị:', error);
        Alert.alert('Lỗi', 'Không thể cập nhật thiết bị. Vui lòng thử lại.');
      }
    };

    console.log({deviceName});

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        onDismiss={onClose}
        enableOverDrag={false}
        enablePanDownToClose
        handleComponent={CustomHandle}
        backdropComponent={CustomBackdrop}
        backgroundComponent={CustomBackground}>
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.customHandle}>
            <View style={styles.indicator} />
          </View>

          <Text style={styles.title}>Sửa thông tin thiết bị</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.text}>Tên thiết bị</Text>
            <TextInput
              style={styles.input}
              placeholder="Galaxy Z Fold 6, iPhone 16 Pro Max, ..."
              placeholderTextColor="#87B6DE"
              value={deviceName}
              onChangeText={vl => {
                setDeviceName(vl);
                console.log(vl);
              }}
            />
          </View>

          <View style={styles.brandSelectionContainer}>
            <Text style={styles.text}>Hãng</Text>
            <BottomSheetFlatList
              data={brands}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              directionalLockEnabled
              keyboardShouldPersistTaps="handled"
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.brandButton,
                    selectedBrand === item.id && styles.selectedBrandButton,
                  ]}
                  onPress={() => setSelectedBrand(item.id)}>
                  <Text
                    style={[
                      styles.brandText,
                      selectedBrand === item.id && styles.selectedBrandText,
                    ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateButtonText}>Cập Nhật</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default UpdateBottomSheet;
