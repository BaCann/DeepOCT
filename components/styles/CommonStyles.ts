import { Platform } from 'react-native';

export const TextStyles = {
  header: {
    fontSize: 28,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-SemiBold',
      android: 'LeagueSpartan-SemiBold',
      default: 'System',
    }),
    color: '#2260FF',
  },
  label: {
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
    color: '#000000',
  },
  regular: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
      default: 'System',
    }),
    color: '#000000',
  },
  light: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Light',
      android: 'LeagueSpartan-Light',
      default: 'System',
    }),
    color: '#000000',
  },
};

export const ButtonStyles = {
  primary: {
    backgroundColor: '#2260FF',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
  },
  secondary: {
    backgroundColor: '#ECF1FF',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    color: '#2260FF',
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
  },
};

export const InputStyles = {
  container: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#ECF1FF',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#2260FF',
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Regular',
      android: 'LeagueSpartan-Regular',
      default: 'System',
    }),
  },
  label: {
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'LeagueSpartan-Medium',
      android: 'LeagueSpartan-Medium',
      default: 'System',
    }),
    color: '#000000',
    marginBottom: 8,
  },
};

export const Colors = {
  primary: '#2260FF',
  secondary: '#ECF1FF',
  text: '#000000',
  placeholder: '#B5C9FF',
  lightText: '#666666',
};