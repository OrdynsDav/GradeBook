import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { borderRadius, spacing, typography, type ThemeColors } from '../../config/theme';
import { useTheme } from '../../lib/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;
  const variantStyle = getVariantStyle(variant, theme.colors);

  const buttonStyle: ViewStyle[] = [
    styles.base,
    variantStyle,
    styles[`${size}Size`],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ].filter(Boolean) as ViewStyle[];

  const textColor = getTextColor(variant, isDisabled, theme.colors);

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {leftIcon}
          <Text style={[styles.text, styles[`${size}Text`], { color: textColor }, textStyle]}>
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const getVariantStyle = (variant: ButtonVariant, colors: ThemeColors): ViewStyle => {
  switch (variant) {
    case 'primary':
      return { backgroundColor: colors.primary.main };
    case 'secondary':
      return {
        backgroundColor: colors.background.paper,
        borderWidth: 1,
        borderColor: colors.border.light,
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary.main,
      };
    case 'ghost':
      return { backgroundColor: 'transparent' };
    default:
      return { backgroundColor: colors.primary.main };
  }
};

const getTextColor = (variant: ButtonVariant, disabled: boolean, colors: ThemeColors): string => {
  if (disabled) return colors.text.disabled;

  switch (variant) {
    case 'primary':
      return colors.primary.contrast;
    case 'secondary':
      return colors.text.primary;
    case 'outline':
    case 'ghost':
      return colors.primary.main;
    default:
      return colors.primary.contrast;
  }
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  smSize: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  mdSize: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  lgSize: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
  smText: {
    fontSize: typography.fontSize.sm,
  },
  mdText: {
    fontSize: typography.fontSize.md,
  },
  lgText: {
    fontSize: typography.fontSize.lg,
  },
});
