import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Typography, Card } from '@shared/ui';
import { colors, spacing } from '@shared/config/theme';
import { useLogin } from '../model';
import { loginSchema, type LoginFormData } from '../model/loginSchema';

export const LoginForm: React.FC = () => {
  const { handleLogin, loginError, setLoginError } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    defaultValues: { login: '', password: '' },
  });

  const onSubmit = (data: LoginFormData) => handleLogin(data);

  return (
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

      {loginError !== '' && (
        <View style={styles.errorContainer}>
          <Typography variant="body2" style={styles.errorText}>
            {loginError}
          </Typography>
        </View>
      )}

      <Button
        title="Войти"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        fullWidth
        size="lg"
        style={styles.loginButton}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  formCard: {
    marginHorizontal: spacing.md,
    borderRadius: 24,
  },
  formTitle: {
    marginBottom: spacing.lg,
  },
  errorContainer: {
    backgroundColor: `${colors.status.error}15`,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  errorText: {
    color: colors.status.error,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
});
