import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Button,
  Input,
  Typography,
  Card,
} from '@shared/ui';
import { colors, spacing } from '@shared/config/theme';
import { useAuthStore } from '@entities/user';
import { Logo } from '@shared/ui/icons';

const AUTH_BG = require('../../../../assets/images/auth-bg.jpg');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Фон: чуть увеличен и смещён к центру, чтобы важные элементы изображения были видны
const BG_SCALE = 1.15;
const BG_OFFSET_X = -SCREEN_WIDTH * 0.075;
const BG_OFFSET_Y = -SCREEN_HEIGHT * 0.075;

const loginSchema = z.object({
  login: z.string({ error: 'Введите корректный login' }),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const login = useAuthStore((state) => state.login);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    login({
      id: '1',
      login: data.login,
      firstName: 'Давит',
      lastName: 'Акобян',
      middleName: 'Варданович',
      role: 'student',
      className: 'И14-1',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <View style={styles.screenWrapper}>
        <Image
          source={AUTH_BG}
          style={[
            styles.fullScreenBg,
            styles.fullScreenBgImage,
            {
              width: SCREEN_WIDTH * BG_SCALE,
              height: SCREEN_HEIGHT * BG_SCALE + insets.top,
              left: BG_OFFSET_X,
              top: BG_OFFSET_Y - insets.top,
            },
          ]}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(128, 0, 32, 0.75)', 'rgba(74, 0, 18, 0.8)', 'rgba(26, 0, 8, 0.9)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.fullScreenBg,
            { width: SCREEN_WIDTH, height: SCREEN_HEIGHT + insets.top, top: -insets.top },
          ]}
        />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <View style={styles.logoContainer}>
                  <Logo /> 
                </View>
                <Typography variant="h2" color="light" align="center">
                  ПКТ
                </Typography>
                <Typography variant="body1" color="light" align="center" style={styles.subtitle}>
                  Электронный журнал
                </Typography>
              </View>
            </View>

            <Card style={styles.formCard} padding="lg">
              <Typography variant="h3" align="center" style={styles.formTitle}>
                Вход в систему
              </Typography>

              <Controller
                control={control}
                name="login"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Логин"
                    placeholder="Логин с карточки"
                    keyboardType="default"
                    autoCapitalize="none"
                    leftIcon="person-outline"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.login?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Пароль"
                    placeholder="Введите пароль"
                    secureTextEntry
                    leftIcon="lock-closed-outline"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                  />
                )}
              />

              <Button
                title="Войти"
                onPress={handleSubmit(onSubmit)}
                loading={isSubmitting}
                fullWidth
                size="lg"
                style={styles.loginButton}
              />
            </Card>

            <View style={styles.footer}>
              <Typography variant="caption" color="light" align="center">
                © 2026 ПОЧУ ПКТ. Все права защищены.
              </Typography>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary.main,
  },
  screenWrapper: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  fullScreenBg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  fullScreenBgImage: {
    opacity: 0.45,
  },
  header: {
    minHeight: 280,
    paddingTop: spacing.xxl * 2,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginBottom: spacing.md,
    backgroundColor: colors.background.paper,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    marginTop: spacing.xs,
    opacity: 0.9,
  },
  formCard: {
    marginHorizontal: spacing.md,
    borderRadius: 24,
  },
  formTitle: {
    marginBottom: spacing.lg,
  },
  loginButton: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  footer: {
    paddingVertical: spacing.xl,
  },
});
