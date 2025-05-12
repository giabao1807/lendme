import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SectionList, Text, View, Image, TouchableOpacity } from 'react-native';
import styles from './DeviceList.styles';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import database from '@react-native-firebase/database';
import DetailBottomSheet from '../DetailBottomSheet';
import UpdateBottomSheet from '../UpdateBottomSheet/UpdateBottomSheet';
import images from '../../assets/index';

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
  userRole: string | null;
}

type SectionTitle = 'Danh sách thiết bị' | 'Danh sách thiết bị có thể mượn';

export default function DeviceList({
  onDevicePress,
  availableDevices,
  borrowedDevices,
  onEditSheetVisibilityChange,
  userRole,
}: DeviceListProps) {
  const [collapsedSections, setCollapsedSections] = useState<Record<SectionTitle, boolean>>({
    'Danh sách thiết bị': false,
    'Danh sách thiết bị có thể mượn': false,
  });

  const [devicesWithUserData, setDevicesWithUserData] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isDetailBottomSheetOpen, setIsDetailBottomSheetOpen] = useState(false);

  const detailBottomSheetRef = useRef<BottomSheetModal>(null);
  const updateBottomSheetRef = useRef<BottomSheetModal>(null);

  const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  const getBrandIcon = (brand: string) =>
    brand.toLowerCase() === 'apple' ? images.iosIcon : images.androidIcon;

  const toggleSection = (title: SectionTitle) => {
    setCollapsedSections(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleOpenUpdateBottomSheet = () => {
    updateBottomSheetRef.current?.present();
  };

  const handleCloseUpdateBottomSheet = () => {
    updateBottomSheetRef.current?.dismiss();
    setIsDetailBottomSheetOpen(false);
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
              device.borrowDate = { time, datePart };
            }
          }
        }
      }

      setDevicesWithUserData(updatedDevices);
    };

    fetchUserData();
  }, [borrowedDevices]);

  useEffect(() => {
    if (selectedDevice && isDetailBottomSheetOpen) {
      detailBottomSheetRef.current?.present();
      onEditSheetVisibilityChange(true);
    }
  }, [selectedDevice, isDetailBottomSheetOpen, onEditSheetVisibilityChange]);

  const handleEditDevice = () => {
    detailBottomSheetRef.current?.close();
    handleOpenUpdateBottomSheet();
  };

  const sections = useMemo(() => {
    return [
      {
        title: 'Danh sách thiết bị' as SectionTitle,
        data: collapsedSections['Danh sách thiết bị'] ? [] : devicesWithUserData,
      },
      {
        title: 'Danh sách thiết bị có thể mượn' as SectionTitle,
        data: collapsedSections['Danh sách thiết bị có thể mượn'] ? [] : availableDevices,
      },
    ];
  }, [availableDevices, devicesWithUserData, collapsedSections]);

  const handleDeleteDevice = async () => {
    if (!selectedDevice) return;

    try {
      await database().ref(`/devices/${selectedDevice.id}`).remove();

      setDevicesWithUserData(prev =>
        prev.filter(device => device.id !== selectedDevice.id)
      );

      detailBottomSheetRef.current?.close();
      setIsDetailBottomSheetOpen(false);
    } catch (error) {
      console.error('Lỗi khi xóa thiết bị:', error);
    }
  };

  const handleDevicePress = (device: Device, section: string) => {
    if (userRole === 'admin') {
      setSelectedDevice(device);
      setIsDetailBottomSheetOpen(true);
      detailBottomSheetRef.current?.present();
      onEditSheetVisibilityChange(true);
    } else if (
      userRole === 'user' &&
      section === 'Danh sách thiết bị có thể mượn'
    ) {
      onDevicePress(device);
    }
  };

  return (
    <BottomSheetModalProvider>
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={sections}
        keyExtractor={(item, index) => item.id + index}
        renderSectionHeader={({ section: { title } }) => {
          const isCollapsed = collapsedSections[title];
          const arrowIcon = isCollapsed ? images.arrowRight : images.arrowIcon;

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
        renderItem={({ item, section }) => {
          const brand = capitalize(item.brand);
          const icon = getBrandIcon(item.brand);

          return (
            <TouchableOpacity onPress={() => handleDevicePress(item, section.title)}>
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
                      <Text style={styles.borrowName}>{item.borrowerName}</Text>{' '}
                      <Text style={styles.borrowDate}>
                        mượn lúc {item.borrowDate.time} ngày{' '}
                      </Text>
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

      <DetailBottomSheet
        ref={detailBottomSheetRef}
        device={selectedDevice}
        onEdit={handleEditDevice}
        onDelete={handleDeleteDevice}
        onRequestReturn={() => {
          detailBottomSheetRef.current?.close();
        }}
        onClose={() => {
          onEditSheetVisibilityChange(false);
          setIsDetailBottomSheetOpen(false);
        }}
        onVisibilityChange={onEditSheetVisibilityChange}
      />

      <UpdateBottomSheet
        ref={updateBottomSheetRef}
        device={selectedDevice}
        onClose={handleCloseUpdateBottomSheet}
      />
    </BottomSheetModalProvider>
  );
}
