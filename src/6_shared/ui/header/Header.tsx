import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../typography';
import { spacing } from '../../config/theme';
import { useTheme } from '../../lib/theme';

export interface HeaderProps {
  /** Текст заголовка */
  title: string;
  /** Показывать кнопку «назад» (для стек-навигации) */
  showBackButton?: boolean;
  /** Обработчик нажатия «назад» */
  onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.wrapper,
        { paddingTop: insets.top, backgroundColor: theme.colors.primary.main },
      ]}
    >
      <View style={styles.content}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
              size={Platform.OS === 'ios' ? 28 : 24}
              color={theme.colors.primary.contrast}
            />
          </TouchableOpacity>
        )}
        <View style={styles.titleWrap}>
          <Typography
            variant="h4"
            color="light"
            align="left"
            numberOfLines={1}
            style={styles.title}
          >
            {title}
          </Typography>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    minHeight: 140,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
    minWidth: 44,
  },
  titleWrap: {
    flex: 1,
    minWidth: 0,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontWeight: '600',
    fontSize: 24,
  },
});
