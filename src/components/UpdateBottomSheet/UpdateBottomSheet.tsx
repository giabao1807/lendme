import React, {useEffect, useState, forwardRef} from 'react';
import {Alert, Text, View, TouchableOpacity} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import {db} from '../../config/firebaseConfig';
import styles from './UpdateBottomSheet.styles';
import {Device} from '../DeviceList/DeviceList';
//import { TextInput } from 'react-native-gesture-handler';
import {sort} from '../../utils/sortUtils';

const CustomBackdrop = (props: any) => (
  <BottomSheetBackdrop
    {...props}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
    opacity={0.4}
  />
);

const CustomBackground = () => <View style={styles.sheetBackground} />;

interface Brand {
  id: string;
  name: string;
}

interface UpdateBottomSheetProps {
  device: Device | null;
  onClose: () => void;
  onVisibilityChange?: (isVisible: boolean) => void;
}

const UpdateBottomSheet = forwardRef<BottomSheetModal, UpdateBottomSheetProps>(
  ({device, onClose, onVisibilityChange}, ref) => {
    const snapPoints = ['40%'];
    const [deviceName, setDeviceName] = useState('');
    const [brands, setBrands] = useState<Brand[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const sortedBrands = sort(brands);

    useEffect(() => {
      if (device) {
        setDeviceName(device.deviceName ?? '');
        setSelectedBrand(device.brand ?? null);
      }
    }, [device]);

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
        }
      });

      return () => brandsRef.off('value', listener);
    }, []);

    const handleUpdate = async () => {
      if (!device) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin thiết bị.');
        return;
      }

      const trimmedName = deviceName.trim();
      const updates: Partial<Device> = {};

      if (trimmedName && trimmedName !== device.deviceName) {
        updates.deviceName = trimmedName;
      }

      if (selectedBrand !== null) {
        updates.brand = selectedBrand;
      }

      if (Object.keys(updates).length === 0) {
        Alert.alert(
          'Không có thay đổi',
          'Không có thông tin nào được thay đổi.',
        );
        return;
      }

      try {
        await db.ref(`devices/${device.id}`).update(updates);

        Alert.alert(
          'Cập nhật thành công',
          'Thông tin thiết bị đã được cập nhật.',
        );
        (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
        onClose();
      } catch (error) {
        console.error('Lỗi khi cập nhật thiết bị:', error);
        Alert.alert('Lỗi', 'Không thể cập nhật thiết bị. Vui lòng thử lại.');
      }
    };

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        onDismiss={() => {
          onClose();
          onVisibilityChange?.(false);
        }}
        onChange={index => {
          if (index === -1) {
            onVisibilityChange?.(false);
          } else {
            onVisibilityChange?.(true);
          }
        }}
        enableOverDrag={false}
        enablePanDownToClose
        handleComponent={() => null}
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

          <Text style={styles.title}>Sửa thông tin thiết bị</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.text}>Tên thiết bị</Text>
            <BottomSheetTextInput
              style={styles.input}
              placeholder="Nhập tên thiết bị mới"
              placeholderTextColor="#87B6DE"
              value={deviceName}
              onChangeText={setDeviceName}
            />
          </View>

          <View style={styles.brandSelectionContainer}>
            <Text style={styles.text}>Hãng</Text>
            <BottomSheetFlatList
              data={sortedBrands}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
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
