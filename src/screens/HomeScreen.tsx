import React, {useRef, useCallback, useState, useEffect} from 'react';
import {View, SafeAreaView} from 'react-native';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import SearchBar from '../components/SearchBar';
import Admin from '../components/Admin';
import AddButton from '../components/AddButton';
import DeviceList from '../components/DeviceList';
import DeviceBottomSheet from '../components/DeviceBottomSheet';
import BorrowBottomSheet from '../components/BorrowBottomSheet';
import styles from './HomeScreenStyles';
import {Device} from '../components/DeviceList';
import {db} from '../config/firebaseConfig';

export default function HomeScreen() {
  const borrowBottomSheetRef = useRef<BottomSheetModal>(null);
  const deviceBottomSheetRef = useRef<BottomSheetModal>(null);
  const [activeBottomSheet, setActiveBottomSheet] = useState<
    'borrow' | 'device' | null
  >(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const [availableDevices, setAvailableDevices] = useState<Device[]>([]);
  const [borrowedDevices, setBorrowedDevices] = useState<Device[]>([]);
  const [isEditSheetVisible, setIsEditSheetVisible] = useState(false); // NEW

  useEffect(() => {
    const devicesRef = db.ref('devices');

    const listener = devicesRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const devicesArray = Object.values(data) as Device[];
        setAvailableDevices(devicesArray.filter(d => d.status !== 'borrowed'));
        setBorrowedDevices(devicesArray.filter(d => d.status === 'borrowed'));
      } else {
        setAvailableDevices([]);
        setBorrowedDevices([]);
      }
    });

    return () => devicesRef.off('value', listener);
  }, []);
  const handleEditSheetVisibilityChange = useCallback((visible: boolean) => {
    setIsEditSheetVisible(visible);
  }, []);

  const handleDevicePress = useCallback((device: Device) => {
    setSelectedDevice(device);
    borrowBottomSheetRef.current?.present();
    setActiveBottomSheet('borrow');
  }, []);

  const handleAddButtonPress = useCallback(() => {
    deviceBottomSheetRef.current?.present();
    setActiveBottomSheet('device');
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    setActiveBottomSheet(null);
  }, []);

  const handleBorrowSuccess = useCallback(() => {
    setSelectedDevice(null);
  }, []);

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.searchBarContainer}>
          <SearchBar />
          <Admin onPress={() => console.log('Admin button pressed')} />
        </View>

        <DeviceList
          onDevicePress={handleDevicePress}
          availableDevices={availableDevices}
          borrowedDevices={borrowedDevices}
          onEditSheetVisibilityChange={handleEditSheetVisibilityChange}
        />

        {activeBottomSheet === null && !isEditSheetVisible && (
          <AddButton onPress={handleAddButtonPress} />
        )}

        <BorrowBottomSheet
          ref={borrowBottomSheetRef}
          device={selectedDevice}
          onBorrowSuccess={handleBorrowSuccess}
          onClose={handleCloseBottomSheet}
        />

        <DeviceBottomSheet
          ref={deviceBottomSheetRef}
          onClose={handleCloseBottomSheet}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}
