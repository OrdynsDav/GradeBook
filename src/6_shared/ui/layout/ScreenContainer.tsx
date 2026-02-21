import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '../../config/theme';
import { useTheme } from '../../lib/theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  safeArea?: boolean;
  backgroundColor?: string;
  padding?: boolean;
  keyboardAvoiding?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  scrollable = false,
  safeArea = true,
  backgroundColor,
  padding = true,
  keyboardAvoiding = false,
}) => {
  const { theme } = useTheme();
  const resolvedBackgroundColor = backgroundColor ?? theme.colors.background.default;

  const containerStyle: ViewStyle[] = [
    styles.container,
    { backgroundColor: resolvedBackgroundColor },
    padding && styles.padding,
    style,
  ].filter(Boolean) as ViewStyle[];

  const content = scrollable ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[styles.scrollContent, padding && styles.padding]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={containerStyle}>{children}</View>
  );

  const wrappedContent = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  if (safeArea) {
    return (
      <SafeAreaView
        style={[styles.flex, { backgroundColor: resolvedBackgroundColor }]}
        edges={['top', 'left', 'right']}
      >
        {wrappedContent}
      </SafeAreaView>
    );
  }

  return wrappedContent;
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  padding: {
    padding: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
