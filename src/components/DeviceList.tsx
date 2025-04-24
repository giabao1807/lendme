import React, {useState, useMemo, useEffect, useRef} from 'react';
import {SectionList, Text, View, Image, TouchableOpacity} from 'react-native';
import styles from './DeviceListStyles';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import database from '@react-native-firebase/database';
import EditBottomSheet from './EditBottomSheet';

const androidIcon = require('../assets/android_logo.png');
const iosIcon = require('../assets/ios_logo.png');
const arrow = require('../assets/Arrow.png');
const arrowRight = require('../assets/Arrow_right.png');

export interface Device {
  id: string;
  deviceName: string;
  brand: string;
  status?: 'borrowed' | 'available';
  borrowerName?: string;
  borrowDate?: {
    time: string;
    datePart: string;
  };
}

interface DeviceListProps {
  onDevicePress: (device: Device) => void;
  availableDevices: Device[];
  borrowedDevices: Device[];
  onEditSheetVisibilityChange: (visible: boolean) => void;
}

type SectionTitle = 'Danh sách thiết bị' | 'Danh sách thiết bị có thể mượn';

export default function DeviceList({
  onDevicePress,
  availableDevices,
  borrowedDevices,
  onEditSheetVisibilityChange, 
}: DeviceListProps) {
  const [collapsedSections, setCollapsedSections] = useState<
    Record<SectionTitle, boolean>
  >({
    'Danh sách thiết bị': false,
    'Danh sách thiết bị có thể mượn': false,
  });

  const [devicesWithUserData, setDevicesWithUserData] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const editBottomSheetRef = useRef<BottomSheetModal>(null);

  const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  const getBrandIcon = (brand: string) =>
    brand.toLowerCase() === 'apple' ? iosIcon : androidIcon;

  const toggleSection = (title: SectionTitle) => {
    setCollapsedSections(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const updatedDevices = [...borrowedDevices];

      for (const device of updatedDevices) {
        if (device.status === 'borrowed') {
          const userSnapshot = await database()
            .ref('/users')
            .orderByChild('deviceId')
            .equalTo(device.id)
            .once('value');

          const userData = userSnapshot.val();

          if (userData) {
            const userKey = Object.keys(userData)[0];
            const userInfo = userData[userKey];

            device.borrowerName = userInfo.userName;

            if (userInfo.createDate) {
              const [datePart, time] = userInfo.createDate.split(' ');
              device.borrowDate = {time, datePart};
            }
          }
        }
      }

      setDevicesWithUserData(updatedDevices);
    };

    fetchUserData();
  }, [borrowedDevices]);

  useEffect(() => {
    if (selectedDevice) {
      editBottomSheetRef.current?.present();
      onEditSheetVisibilityChange(true);
    }
  }, [selectedDevice,onEditSheetVisibilityChange]);

  const sections = useMemo(() => {
    return [
      {
        title: 'Danh sách thiết bị' as SectionTitle,
        data: collapsedSections['Danh sách thiết bị']
          ? []
          : devicesWithUserData,
      },
      {
        title: 'Danh sách thiết bị có thể mượn' as SectionTitle,
        data: collapsedSections['Danh sách thiết bị có thể mượn']
          ? []
          : availableDevices,
      },
    ];
  }, [availableDevices, devicesWithUserData, collapsedSections]);

  const handleDeleteDevice = async () => {
    if (!selectedDevice) return;

    try {
      await database().ref(`/devices/${selectedDevice.id}`).remove();

      setDevicesWithUserData(prev =>
        prev.filter(device => device.id !== selectedDevice.id),
      );

      editBottomSheetRef.current?.close();
      setSelectedDevice(null);
    } catch (error) {
      console.error('Lỗi khi xóa thiết bị:', error);
    }
  };

  return (
    <BottomSheetModalProvider>
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={sections}
        keyExtractor={(item, index) => item.id + index}
        renderSectionHeader={({section: {title}}) => {
          const isCollapsed = collapsedSections[title];
          const arrowIcon = isCollapsed ? arrowRight : arrow;

          return (
            <TouchableOpacity onPress={() => toggleSection(title)}>
              <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionHeader}>{title}</Text>
                <Image
                  source={arrowIcon}
                  style={isCollapsed ? styles.arrowIconRight : styles.arrowIcon}
                />
              </View>
            </TouchableOpacity>
          );
        }}
        renderItem={({item, section}) => {
          const brand = capitalize(item.brand);
          const icon = getBrandIcon(item.brand);

          const isAvailableSection =
            section.title === 'Danh sách thiết bị có thể mượn';

          return (
            <TouchableOpacity
              onPress={() => {
                if (isAvailableSection) {
                  onDevicePress(item);
                } else {
                  setSelectedDevice(item);
                }
              }}>
              <View style={styles.itemContainer}>
                <Image source={icon} style={styles.deviceIcon} />
                <View style={styles.textContainer}>
                  <Text style={styles.deviceNameText}>
                    {brand} {item.deviceName}
                  </Text>
                  {item.status === 'borrowed' &&
                  item.borrowerName &&
                  item.borrowDate ? (
                    <Text style={styles.subText}>
                      {item.borrowerName} mượn lúc {item.borrowDate.time} ngày{' '}
                      {item.borrowDate.datePart}
                    </Text>
                  ) : (
                    <Text style={styles.subText}>Thiết bị có sẵn</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <EditBottomSheet
        ref={editBottomSheetRef}
        device={selectedDevice}
        onEdit={() => {
          console.log('Sửa thông tin thiết bị:', selectedDevice);
          editBottomSheetRef.current?.close();
        }}
        onDelete={handleDeleteDevice}
        onRequestReturn={() => {
          console.log('Gửi yêu cầu trả thiết bị:', selectedDevice);
          editBottomSheetRef.current?.close();
        }}
        onClose={() => {
          setSelectedDevice(null);
          onEditSheetVisibilityChange(false);
        }}
        onVisibilityChange={onEditSheetVisibilityChange}
      />
    </BottomSheetModalProvider>
  );
}
