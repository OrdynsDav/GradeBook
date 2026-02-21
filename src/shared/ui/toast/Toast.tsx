import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../typography';
import { colors, spacing } from '../../config/theme';

export interface ToastProps {
  /** Показывать тост */
  visible: boolean;
  /** Текст в тосте (например: "Скопировано") */
  text: string;
  /** Иконка слева от текста (Ionicons). По умолчанию — галочка в круге */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Время показа в мс, после чего тост скрывается */
  duration?: number;
  /** Доп. отступ сверху после safe area (0 = прижать к верху) */
  topOffset?: number;
  /** Вызывается, когда тост скрылся (после анимации) */
  onDismiss?: () => void;
}

const SLIDE_START = -100;
const ANIM_IN_DURATION = 300;
const ANIM_OUT_DURATION = 250;
const DEFAULT_DURATION = 2500;

export const Toast: React.FC<ToastProps> = ({
  visible,
  text,
  icon = 'checkmark-circle',
  duration = DEFAULT_DURATION,
  topOffset = 0,
  onDismiss,
}) => {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(SLIDE_START)).current;

  useEffect(() => {
    if (!visible) return;
    slideAnim.setValue(SLIDE_START);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: ANIM_IN_DURATION,
      useNativeDriver: true,
    }).start();
    const timer = setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: SLIDE_START,
        duration: ANIM_OUT_DURATION,
        useNativeDriver: true,
      }).start(() => onDismiss?.());
    }, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, slideAnim, onDismiss]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { paddingTop: insets.top + topOffset },
        { transform: [{ translateY: slideAnim }] },
      ]}
      pointerEvents="none"
    >
      <View style={styles.toast}>
        <Ionicons
          name={icon}
          size={24}
          color={colors.primary.contrast}
          style={styles.icon}
        />
        <Typography variant="body1" color="light">
          {text}
        </Typography>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  toast: {
    backgroundColor: colors.primary.main,
    borderRadius: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  icon: {
    marginRight: spacing.sm,
  },
});
