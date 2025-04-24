import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingLeft: 16,
    paddingRight: 22,
    paddingVertical: 9,
  },
  sectionHeader: {
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.43,
  },
  arrowIcon: {
    width: 12,
    height: 7.41,
    tintColor: '#115EA3',
  },
  arrowIconRight: {
    width: 7.41,
    height: 12,
    tintColor: '#115EA3',
    //marginRight: 17.3,
    // nếu bạn dùng chung ảnh hướng xuống
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  deviceIcon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  deviceNameText: {
    marginBottom: 3,
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.43,
  },
  subText: {
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: -0.43,
    color: '#616161',
  },
});

export default styles;
