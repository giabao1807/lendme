import React, {useState} from 'react';
import {View, TextInput, Image} from 'react-native';
import styles from './SearchBarStyles';

export default function SearchBar() {
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.searchBar}>
      <Image
        source={require('../assets/Search.png')}
        style={styles.searchIcon}
      />

      <TextInput
        style={styles.input}
        placeholder="Tìm thiết bị"
        placeholderTextColor="#fff"
        value={searchText}
        onChangeText={setSearchText}
      />
    </View>
  );
}
