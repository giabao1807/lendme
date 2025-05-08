import React, {useState} from 'react';
import {View, TextInput, Image} from 'react-native';
import styles from './SearchBar.styles';
import images from '../../assets';

interface SearchBarProps {
  onSearch: (text: string) => void;
}

export default function SearchBar({onSearch}: SearchBarProps) {
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };

  return (
    <View style={styles.searchBar}>
      <Image
        source={images.searchIcon}
        style={styles.searchIcon}
      />

      <TextInput
        style={styles.input}
        placeholder="Tìm thiết bị"
        placeholderTextColor="#fff"
        value={searchText}
        onChangeText={handleSearchChange}
      />
    </View>
  );
}
