import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import { borderRadius, spacing, shadows } from '../../config/theme';
import { useTheme } from '../../lib/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'elevated',
  padding = 'md',
}) => {
  const { theme } = useTheme();

  const cardStyle: ViewStyle[] = [
    styles.base,
    { backgroundColor: theme.colors.background.paper },
    styles[variant],
    variant === 'outlined' && { borderColor: theme.colors.border.light },
    variant === 'filled' && { backgroundColor: theme.colors.background.default },
    padding !== 'none' && styles[`${padding}Padding`],
    style,
  ].filter(Boolean) as ViewStyle[];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
  },
  elevated: {
    ...shadows.md,
  },
  outlined: {
    borderWidth: 1,
  },
  filled: {},
  smPadding: {
    padding: spacing.sm,
  },
  mdPadding: {
    padding: spacing.md,
  },
  lgPadding: {
    padding: spacing.lg,
  },
});
