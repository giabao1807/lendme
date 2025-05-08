import React from 'react';
import { Text, TouchableOpacity, View, FlatList } from 'react-native';
import styles from './AddBottomSheet.styles';
import { sort } from '../../utils/sortUtils';

interface Brand {
  id: string;
  name: string;
}

interface Props {
  brands: Brand[];
  selectedBrand: string | null;
  onSelect: (id: string) => void;
}

const BrandSelector = ({ brands, selectedBrand, onSelect }: Props) => {
  const sortedBrands = sort(brands);

  return (
    <View style={styles.brandSelectionContainer}>
      <Text style={styles.text}>Hãng</Text>
      <FlatList
        data={sortedBrands}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        directionalLockEnabled
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        renderItem={({ item }) => (
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
};

export default BrandSelector;
