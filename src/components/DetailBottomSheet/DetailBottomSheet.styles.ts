import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#115EA3',
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#115EA3',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    paddingTop: 0,
    //paddingBottom: 36,
  },
  customHandle: {
    alignItems: 'center',
    paddingTop: 8,
    marginBottom: 13,
    //backgroundColor: 'red',
  },
  indicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D1D1',
  },
  title: {
    paddingLeft: 16,
    //marginTop: 13,
    fontFamily: 'Roboto-Medium',
    paddingVertical: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 22,
    letterSpacing: -0.43,
    //backgroundColor: 'red',
  },

  editContainer: {
    //backgroundColor: 'red',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 16,
  },
  deleteContainer: {
    //backgroundColor: 'black',
    flexDirection: 'row',
    paddingLeft: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
    resizeMode: 'contain',
    paddingVertical: 12,
  },

  optionText: {
    //backgroundColor: 'white',
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.43,
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 13,
  },
  requestContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 16,
    //backgroundColor: 'red',
  },
});

export default styles;
