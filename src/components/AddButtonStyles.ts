import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    bottom: 38,
    right: 16,
    width: 56,
    height: 56,
    backgroundColor: 'red',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',

    //shadowOffset: {width: 0, height: 2},
    //shadowOpacity: 0.25,
    //shadowRadius: 3.84,
    //elevation: 5, // Hiệu ứng nổi trên Android
  },
  addIcon: {
    width: 24,
    height: 24,
  },
});

export default styles;
