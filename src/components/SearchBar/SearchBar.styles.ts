import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  searchBar: {
    width: 314,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#115EA3',
    borderRadius: 12,
    //paddingVertical: 4,
    height: 40,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.43,
    marginRight: 32,
    paddingVertical: 6,
  },
});

export default styles;
