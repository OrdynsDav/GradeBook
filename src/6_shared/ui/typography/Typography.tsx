import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { typography } from '../../config/theme';
import { useTheme } from '../../lib/theme';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'label';

type TypographyColor = 'primary' | 'secondary' | 'disabled' | 'light' | 'error' | 'success';

interface TypographyProps {
  children: React.ReactNode;
  variant?: TypographyVariant;
  color?: TypographyColor;
  style?: TextStyle;
  numberOfLines?: number;
  align?: 'left' | 'center' | 'right';
  /** Включить выделение текста для копирования (долгое нажатие) */
  selectable?: boolean;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body1',
  color = 'primary',
  style,
  numberOfLines,
  align = 'left',
  selectable,
}) => {
  const { theme } = useTheme();
  const colorMap: Record<TypographyColor, string> = {
    primary: theme.colors.text.primary,
    secondary: theme.colors.text.secondary,
    disabled: theme.colors.text.disabled,
    light: theme.colors.text.light,
    error: theme.colors.status.error,
    success: theme.colors.status.success,
  };

  return (
    <Text
      style={[
        styles[variant],
        { color: colorMap[color], textAlign: align },
        style,
      ]}
      numberOfLines={numberOfLines}
      selectable={selectable}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: '700',
    lineHeight: typography.fontSize.xxxl * typography.lineHeight.tight,
  },
  h2: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    lineHeight: typography.fontSize.xxl * typography.lineHeight.tight,
  },
  h3: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
    lineHeight: typography.fontSize.xl * typography.lineHeight.tight,
  },
  h4: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    lineHeight: typography.fontSize.lg * typography.lineHeight.normal,
  },
  body1: {
    fontSize: typography.fontSize.md,
    fontWeight: '400',
    lineHeight: typography.fontSize.md * typography.lineHeight.normal,
  },
  body2: {
    fontSize: typography.fontSize.sm,
    fontWeight: '400',
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
  caption: {
    fontSize: typography.fontSize.xs,
    fontWeight: '400',
    lineHeight: typography.fontSize.xs * typography.lineHeight.normal,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
});
