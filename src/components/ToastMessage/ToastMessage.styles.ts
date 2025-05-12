import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  containerToast: {
    backgroundColor: '#CFE4FA',
    paddingVertical: 16,
    paddingHorizontal: 17,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    //backgroundColor: 'red',
    color: '#0F548C',
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.43,
    textAlign: 'center',
  },
  bold: {
    color: '#0F548C',
    fontFamily: 'Roboto-Bold',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.43,
  },
});

export default styles;
