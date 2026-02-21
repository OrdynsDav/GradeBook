import React from 'react';
import { View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, ScreenContainer, Typography } from '@shared/ui';
import { borderRadius, spacing } from '@shared/config/theme';
import { useTheme } from '@shared/lib';
import {
  type NotificationSettings,
  type ThemeMode,
  useSettingsStore,
} from '@entities/settings';

type NotificationTypeKey = Exclude<keyof NotificationSettings, 'enabled'>;

interface NotificationRowConfig {
  key: NotificationTypeKey;
  title: string;
  subtitle: string;
}

const NOTIFICATION_ROWS: NotificationRowConfig[] = [
  {
    key: 'grades',
    title: 'Оценки',
    subtitle: 'Новые оценки и изменения по предметам',
  },
  {
    key: 'homework',
    title: 'Домашние задания',
    subtitle: 'Новые задания и изменения дедлайнов',
  },
  {
    key: 'announcements',
    title: 'Объявления',
    subtitle: 'Важные объявления',
  },
];

const THEME_OPTIONS: Array<{
  value: ThemeMode;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  {
    value: 'system',
    title: 'Системный',
    subtitle: 'Следовать системной теме устройства',
    icon: 'phone-portrait-outline',
  },
  {
    value: 'light',
    title: 'Светлый',
    subtitle: 'Светлое оформление приложения',
    icon: 'sunny-outline',
  },
  {
    value: 'dark',
    title: 'Темный',
    subtitle: 'Темное оформление приложения',
    icon: 'moon-outline',
  },
];

interface SwitchRowProps {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (nextValue: boolean) => void;
  disabled?: boolean;
  showDivider?: boolean;
}

const SwitchRow: React.FC<SwitchRowProps> = ({
  title,
  subtitle,
  value,
  onValueChange,
  disabled = false,
  showDivider = false,
}) => {
  const { theme } = useTheme();

  return (
    <View>
      <View style={[styles.row, disabled && styles.rowDisabled]}>
        <View style={styles.rowContent}>
          <Typography variant="body1">{title}</Typography>
          <Typography variant="caption" color="secondary">
            {subtitle}
          </Typography>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{
            false: theme.colors.border.main,
            true: theme.colors.primary.light,
          }}
          thumbColor={value ? theme.colors.primary.main : theme.colors.background.paper}
          ios_backgroundColor={theme.colors.border.main}
        />
      </View>
      {showDivider && <View style={[styles.divider, { backgroundColor: theme.colors.border.light }]} />}
    </View>
  );
};

export const SettingsScreen: React.FC = () => {
  const { theme, themeMode, resolvedMode, setThemeMode } = useTheme();

  const notifications = useSettingsStore((state) => state.notifications);
  const setNotificationsEnabled = useSettingsStore((state) => state.setNotificationsEnabled);
  const setNotificationType = useSettingsStore((state) => state.setNotificationType);

  return (
    <ScreenContainer scrollable>
      <Card style={styles.sectionCard} padding="none">
        <View style={styles.sectionHeader}>
          <Typography variant="h4">Уведомления</Typography>
          <Typography variant="caption" color="secondary">
            Управление локальными уведомлениями
          </Typography>
        </View>

        <SwitchRow
          title="Включить уведомления"
          subtitle="Главный переключатель для всех типов"
          value={notifications.enabled}
          onValueChange={setNotificationsEnabled}
          showDivider
        />

        {NOTIFICATION_ROWS.map((row, idx) => (
          <SwitchRow
            key={row.key}
            title={row.title}
            subtitle={row.subtitle}
            value={notifications[row.key]}
            onValueChange={(nextValue) => setNotificationType(row.key, nextValue)}
            disabled={!notifications.enabled}
            showDivider={idx < NOTIFICATION_ROWS.length - 1}
          />
        ))}
      </Card>

      <Card style={styles.sectionCard} padding="none">
        <View style={styles.sectionHeader}>
          <Typography variant="h4">Внешний вид</Typography>
          <Typography variant="caption" color="secondary">
            Применяется сразу по всему приложению
          </Typography>
        </View>

        {THEME_OPTIONS.map((option) => {
          const isSelected = option.value === themeMode;

          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => setThemeMode(option.value)}
              activeOpacity={0.75}
              style={[
                styles.themeOption,
                {
                  borderColor: isSelected ? theme.colors.primary.main : theme.colors.border.light,
                  backgroundColor: isSelected
                    ? `${theme.colors.primary.main}1A`
                    : theme.colors.background.paper,
                },
              ]}
            >
              <View style={styles.themeOptionLeft}>
                <View
                  style={[
                    styles.themeIconWrap,
                    { backgroundColor: `${theme.colors.primary.main}14` },
                  ]}
                >
                  <Ionicons name={option.icon} size={18} color={theme.colors.primary.main} />
                </View>
                <View style={styles.themeOptionText}>
                  <Typography variant="body1">{option.title}</Typography>
                  <Typography variant="caption" color="secondary">
                    {option.value === 'system'
                      ? `${option.subtitle} (сейчас: ${resolvedMode === 'dark' ? 'dark' : 'light'})`
                      : option.subtitle}
                  </Typography>
                </View>
              </View>

              <Ionicons
                name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={isSelected ? theme.colors.primary.main : theme.colors.text.disabled}
              />
            </TouchableOpacity>
          );
        })}
      </Card>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  rowDisabled: {
    opacity: 0.55,
  },
  rowContent: {
    flex: 1,
    gap: spacing.xs,
  },
  divider: {
    height: 1,
    marginLeft: spacing.md,
  },
  themeOption: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  themeOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  themeIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeOptionText: {
    flex: 1,
    gap: 2,
  },
});
