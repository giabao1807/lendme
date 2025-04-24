import React from 'react';
import { Text, TouchableOpacity, View} from 'react-native';
import styles from './AddDeviceBottomSheetStyles';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
interface Brand {
  id: string;
  name: string;
}

interface Props {
  brands: Brand[];
  selectedBrand: string | null;
  onSelect: (id: string) => void;
}

const BrandSelector = ({brands, selectedBrand, onSelect}: Props) => (
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
          onPress={() => onSelect(item.id)}>
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
);

export default BrandSelector;
