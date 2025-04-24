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
  },
  customHandle: {
    alignItems: 'center',
    paddingTop: 8,
    // backgroundColor: 'red',
  },
  indicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D1D1',
  },
  title: {
    marginTop: 17,
    paddingLeft: 16,
    fontFamily: 'Roboto-Medium',
    paddingVertical: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 22,
    letterSpacing: -0.43,
  },
  inputContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 17,
  },
  text: {
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    color: '#FFFFFF',
    fontSize: 14,
    letterSpacing: -0.43,
    lineHeight: 22,
  },

  inputText: {
    marginTop: 10,
    borderRadius: 10,
    paddingLeft: 12,
    backgroundColor: '#0F6CBD',
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: -0.43,
    paddingVertical: 7,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#FFFFFF',
  },
  checkboxTick: {
    color: '#115EA3',
    fontWeight: 'bold',
    fontSize: 16,
  },

  button: {
    backgroundColor: '#115EA3',
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  buttonText: {
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.43,
  },
});

export default styles;
