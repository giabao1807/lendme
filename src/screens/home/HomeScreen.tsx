import React, {useRef, useCallback, useState, useEffect} from 'react';
import {View, Modal, Text, TouchableOpacity} from 'react-native';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import SearchBar from '../../components/SearchBar';
import Login from '../../components/Login';
import AddButton from '../../components/AddButton';
import DeviceList, {Device} from '../../components/DeviceList/DeviceList';
import DeviceBottomSheet from '../../components/DeviceBottomSheet';
import BorrowBottomSheet from '../../components/BorrowBottomSheet';
import DetailBottomSheet from '../../components/DetailBottomSheet';
import UpdateBottomSheet from '../../components/UpdateBottomSheet';

import {db} from '../../config/firebaseConfig';
import {RootStackParamList} from '../../navigation/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import styles from './HomeScreen.styles';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const borrowBottomSheetRef = useRef<BottomSheetModal>(null);
  const deviceBottomSheetRef = useRef<BottomSheetModal>(null);
  const updateBottomSheetRef = useRef<BottomSheetModal>(null);

  const [activeBottomSheet, setActiveBottomSheet] = useState<
    'borrow' | 'device' | null
  >(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const [availableDevices, setAvailableDevices] = useState<Device[]>([]);
  const [borrowedDevices, setBorrowedDevices] = useState<Device[]>([]);
  const [filteredAvailableDevices, setFilteredAvailableDevices] = useState<
    Device[]
  >([]);
  const [filteredBorrowedDevices, setFilteredBorrowedDevices] = useState<
    Device[]
  >([]);

  const [searchText, setSearchText] = useState('');
  const [isEditSheetVisible, setIsEditSheetVisible] = useState(false);
  const [isUpdateSheetVisible, setIsUpdateSheetVisible] = useState(false);

  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [adminModalVisible, setAdminModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchUserInfo = async () => {
        const username = await AsyncStorage.getItem('loggedInUser');
        const role = await AsyncStorage.getItem('userRole');
        setLoggedInUser(username);
        setUserRole(role);
      };
      fetchUserInfo();
    }, []),
  );

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

  useEffect(() => {
    const trimmedSearchText = searchText.trim().toLowerCase();

    setFilteredAvailableDevices(
      availableDevices.filter(device => {
        const combinedString = `${device.brand || ''} ${
          device.deviceName
        }`.toLowerCase();
        return combinedString.includes(trimmedSearchText);
      }),
    );

    setFilteredBorrowedDevices(
      borrowedDevices.filter(device => {
        const combinedString = `${device.brand || ''} ${
          device.deviceName
        }`.toLowerCase();
        return combinedString.includes(trimmedSearchText);
      }),
    );
  }, [searchText, availableDevices, borrowedDevices]);

  const handleDevicePress = (device: Device) => {
    if (userRole === 'user') {
      setSelectedDevice(device);
      borrowBottomSheetRef.current?.present();
      setActiveBottomSheet('borrow');
    }
  };

  const handleAddButtonPress = () => {
    if (userRole === 'admin') {
      deviceBottomSheetRef.current?.present();
      setActiveBottomSheet('device');
    }
  };

  const handleAdminPress = () => {
    loggedInUser ? setAdminModalVisible(true) : navigation.navigate('Login');
  };

  const handleLogout = async () => {
    const username = await AsyncStorage.getItem('loggedInUser');
    if (username) {
      await db.ref(`/accounts/${username}`).update({fcmToken: ''});
    }

    await AsyncStorage.clear();
    setLoggedInUser(null);
    setUserRole(null);
    setAdminModalVisible(false);

    navigation.navigate('Login');
  };

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.searchBarContainer}>
          <SearchBar onSearch={setSearchText} />
          <Login onPress={handleAdminPress} />
        </View>

        <DeviceList
          onDevicePress={handleDevicePress}
          availableDevices={filteredAvailableDevices}
          borrowedDevices={filteredBorrowedDevices}
          onEditSheetVisibilityChange={setIsEditSheetVisible}
          userRole={userRole}
        />

        {activeBottomSheet === null &&
          !isEditSheetVisible &&
          !isUpdateSheetVisible &&
          userRole === 'admin' && <AddButton onPress={handleAddButtonPress} />}

        {userRole === 'user' && (
          <BorrowBottomSheet
            ref={borrowBottomSheetRef}
            device={selectedDevice}
            onBorrowSuccess={() => setSelectedDevice(null)}
            onClose={() => setActiveBottomSheet(null)}
          />
        )}

        {userRole === 'admin' && (
          <>
            <DeviceBottomSheet
              ref={deviceBottomSheetRef}
              onClose={() => setActiveBottomSheet(null)}
            />

            <UpdateBottomSheet
              ref={updateBottomSheetRef}
              device={selectedDevice}
              onClose={() => {

                setSelectedDevice(null);
              }}
              onVisibilityChange={setIsUpdateSheetVisible}
            />
          </>
        )}

        <DetailBottomSheet
          device={selectedDevice}
          onDelete={() => console.log('Delete device')}
          onRequestReturn={() => console.log('Request return device')}
          onClose={() => setIsEditSheetVisible(false)}
          onVisibilityChange={setIsEditSheetVisible}
          onEdit={() => {
            //setIsUpdateSheetVisible(true);
            updateBottomSheetRef.current?.present();
            setIsEditSheetVisible(false);
          }}
        />

        <Modal
          transparent
          visible={adminModalVisible}
          animationType="fade"
          onRequestClose={() => setAdminModalVisible(false)}>
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPressOut={() => setAdminModalVisible(false)}>
            <View style={styles.popup}>
              <Text style={styles.username}>Xin chào: {loggedInUser}</Text>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}>
                <Text style={styles.logoutText}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}
