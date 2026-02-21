import { Dimensions, PixelRatio, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const baseWidth = 375;
const baseHeight = 812;

export const scale = (size: number): number => {
  return (SCREEN_WIDTH / baseWidth) * size;
};

export const verticalScale = (size: number): number => {
  return (SCREEN_HEIGHT / baseHeight) * size;
};

export const moderateScale = (size: number, factor = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

export const isTablet = (): boolean => {
  return SCREEN_WIDTH >= 768;
};

export const isSmallDevice = (): boolean => {
  return SCREEN_WIDTH < 375;
};

export const getResponsiveValue = <T>(
  phone: T,
  tablet: T
): T => {
  return isTablet() ? tablet : phone;
};

export const normalize = (size: number): number => {
  const newSize = scale(size);
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

export { wp, hp };
