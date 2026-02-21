import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography } from '../../config/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

const MASK_CHAR = '\u2022';

function getMaskedDisplay(length: number): string {
  return length > 0 ? MASK_CHAR.repeat(length) : '';
}

function deriveRealPasswordFromChange(
  newDisplay: string,
  prevReal: string,
  prevDisplayLen: number
): string {
  if (newDisplay.length === 0) return '';
  if (newDisplay.indexOf(MASK_CHAR) === -1) return newDisplay;
  if (newDisplay.length > prevDisplayLen) {
    const added = newDisplay.slice(prevDisplayLen);
    const typed = added.replace(new RegExp(MASK_CHAR.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
    return prevReal + typed;
  }
  if (newDisplay.length < prevDisplayLen) return prevReal.slice(0, newDisplay.length);
  return [...prevReal]
    .map((c, i) => (newDisplay[i] === MASK_CHAR ? c : newDisplay[i]))
    .join('');
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  secureTextEntry,
  value = '',
  onChangeText,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const prevDisplayLenRef = useRef(0);

  const isPassword = secureTextEntry !== undefined;
  const showPassword = isPassword && isPasswordVisible;
  const isSecure = isPassword && !showPassword;

  const realValue = typeof value === 'string' ? value : '';
  const displayValue = isSecure ? getMaskedDisplay(realValue.length) : realValue;

  useEffect(() => {
    prevDisplayLenRef.current = displayValue.length;
  }, [displayValue.length]);

  const handleChangeText = (text: string) => {
    if (!onChangeText) return;
    if (!isSecure || showPassword) {
      onChangeText(text);
      return;
    }
    const newReal = deriveRealPasswordFromChange(
      text,
      realValue,
      prevDisplayLenRef.current
    );
    prevDisplayLenRef.current = newReal.length;
    onChangeText(newReal);
  };

  const borderColor = error
    ? colors.status.error
    : isFocused
    ? colors.primary.main
    : colors.border.light;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[styles.inputContainer, { borderColor }]}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={colors.text.secondary}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          {...props}
          value={displayValue}
          onChangeText={handleChangeText}
          style={[styles.input, leftIcon && styles.inputWithLeftIcon]}
          placeholderTextColor={colors.text.disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={false}
          autoComplete={isPassword ? 'password' : props.autoComplete}
          textContentType={isPassword && Platform.OS === 'ios' ? 'password' : props.textContentType}
          autoCorrect={isPassword ? false : props.autoCorrect}
          spellCheck={isPassword ? false : props.spellCheck}
        />
        
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.rightIconButton}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !isPassword && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconButton}
            disabled={!onRightIconPress}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.error}>{error}</Text>}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.paper,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  inputWithLeftIcon: {
    paddingLeft: 12,
  },
  leftIcon: {
    marginLeft: spacing.md,
  },
  rightIconButton: {
    padding: spacing.md,
  },
  error: {
    fontSize: typography.fontSize.xs,
    color: colors.status.error,
    marginTop: spacing.xs,
  },
  hint: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
