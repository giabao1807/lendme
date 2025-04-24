import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#115EA3',
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#115EA3',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    paddingTop: 0,
  },
  customHandle: {
    alignItems: 'center',
    paddingTop: 8,
  },
  indicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D1D1',
  },
  title: {
    fontFamily: 'Roboto-Medium',
    paddingVertical: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 22,
    letterSpacing: -0.43,
    paddingLeft: 16,
    marginTop: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  icon: {
    width: 26.27,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
    paddingVertical: 12,
    marginLeft: 16,
    marginRight: 10.73,
  },
  text: {
    paddingVertical: 13,
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.43,
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default styles;
