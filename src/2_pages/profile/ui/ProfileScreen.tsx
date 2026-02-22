import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, Typography, Card, Button } from '@shared/ui';
import { spacing, borderRadius } from '@shared/config/theme';
import { useTheme } from '@shared/lib';
import { useAuthStore } from '@entities/user';
import { useGradesStore, getComputedFromStore } from '@entities/grades';
import { NotificationsApi } from '@shared/lib/api';
import type { ProfileStackParamList } from '@shared/lib/navigation';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'ProfileMain'>;

const withAlpha = (hexColor: string, alphaHex: string): string => `${hexColor}${alphaHex}`;

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showBadge?: boolean;
  badgeCount?: number;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showBadge,
  badgeCount,
}) => {
  const { theme, isDark } = useTheme();
  const accentColor = isDark ? theme.colors.primary.light : theme.colors.primary.main;

  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: withAlpha(accentColor, isDark ? '2B' : '10') }]}>
        <Ionicons name={icon} size={24} color={accentColor} />
      </View>
      <View style={styles.menuContent}>
        <Typography variant="body1">{title}</Typography>
        {subtitle && (
          <Typography variant="caption" color="secondary">
            {subtitle}
          </Typography>
        )}
      </View>
      <View style={styles.menuRight}>
        {showBadge && (badgeCount ?? 0) > 0 ? (
          <View style={[styles.badge, { backgroundColor: theme.colors.status.error }]}>
            <Typography variant="caption" color="light">
              {badgeCount}
            </Typography>
          </View>
        ) : null}
        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
      </View>
    </TouchableOpacity>
  );
};

export const ProfileScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const gradesBySubject = useGradesStore((s) => s.gradesBySubject);
  const computed = getComputedFromStore(gradesBySubject);
  const accentColor = isDark ? theme.colors.primary.light : theme.colors.primary.main;
  const ATTENDANCE_PERCENT = 98;

  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = async () => {
    try {
      const data = await NotificationsApi.getNotifications({ status: 'unread', limit: 1 });
      setUnreadCount(data.total);
    } catch (error) {
      console.warn('Failed to load unread notifications count:', error);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    loadUnreadCount();
  }, []);

  const getFullName = () => {
    if (!user) return '';
    return `${user.lastName} ${user.firstName} ${user.middleName || ''}`.trim();
  };

  const getRoleLabel = () => {
    if (!user) return '';
    const roles: Record<string, string> = {
      student: 'Студент',
      teacher: 'Учитель',
      admin: 'Администратор',
    };
    return roles[user.role] || user.role;
  };

  const handleNotifications = useCallback(() => navigation.navigate('Notifications'), [navigation]);
  const handleSettings = useCallback(() => navigation.navigate('Settings'), [navigation]);
  const handleHelp = useCallback(() => navigation.navigate('Help'), [navigation]);
  const handleAboutApp = useCallback(() => navigation.navigate('AboutApp'), [navigation]);

  return (
    <ScreenContainer scrollable>
      <Card style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: withAlpha(accentColor, isDark ? '2B' : '20') }]}>
            <Ionicons name="person" size={48} color={accentColor} />
          </View>
        </View>
        <Typography variant="h3" align="center">
          {getFullName()}
        </Typography>
        <Typography variant="body2" color="secondary" align="center">
          {getRoleLabel()} • группа {user?.className} 
        </Typography>
      </Card>

      <Card style={styles.menuCard} padding="none">
        <MenuItem
          icon="notifications-outline"
          title="Уведомления"
          subtitle="Оценки, домашние задания, объявления"
          onPress={handleNotifications}
          showBadge
          badgeCount={unreadCount}
        />
        <View style={[styles.menuDivider, { backgroundColor: theme.colors.border.light }]} />
        <MenuItem
          icon="settings-outline"
          title="Настройки"
          subtitle="Уведомления и внешний вид"
          onPress={handleSettings}
        />
        <View style={[styles.menuDivider, { backgroundColor: theme.colors.border.light }]} />
        <MenuItem
          icon="help-circle-outline"
          title="Помощь"
          subtitle="FAQ, поддержка"
          onPress={handleHelp}
        />
        <View style={[styles.menuDivider, { backgroundColor: theme.colors.border.light }]} />
        <MenuItem
          icon="information-circle-outline"
          title="О приложении"
          subtitle="Версия 1.0.0"
          onPress={handleAboutApp}
        />
      </Card>

      <Card style={styles.statsCard}>
        <Typography variant="h4" style={styles.statsTitle}>
          Статистика за семестр
        </Typography>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Typography variant="h2" style={{ color: theme.colors.grades.excellent }}>
              {computed.fivesCount}
            </Typography>
            <Typography variant="caption" color="secondary">
              Пятёрок
            </Typography>
          </View>
          <View style={styles.statItem}>
            <Typography variant="h2" style={{ color: theme.colors.grades.good }}>
              {computed.foursCount}
            </Typography>
            <Typography variant="caption" color="secondary">
              Четвёрок
            </Typography>
          </View>
          <View style={styles.statItem}>
            <Typography variant="h2" style={{ color: theme.colors.grades.satisfactory }}>
              {computed.threesCount}
            </Typography>
            <Typography variant="caption" color="secondary">
              Троек
            </Typography>
          </View>
          <View style={styles.statItem}>
            <Typography variant="h2" style={{ color: accentColor }}>
              {ATTENDANCE_PERCENT}%
            </Typography>
            <Typography variant="caption" color="secondary">
              Посещаемость
            </Typography>
          </View>
        </View>
      </Card>

      <Button
        title="Выйти из аккаунта"
        onPress={logout}
        variant="outline"
        fullWidth
        style={{
          ...styles.logoutButton,
          borderColor: accentColor,
          backgroundColor: withAlpha(accentColor, isDark ? '14' : '08'),
        }}
        textStyle={{ color: accentColor }}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuCard: {
    marginBottom: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuDivider: {
    height: 1,
    marginLeft: 72,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    minWidth: 24,
    alignItems: 'center',
  },
  statsCard: {
    marginBottom: spacing.md,
  },
  statsTitle: {
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  logoutButton: {
    marginBottom: spacing.lg,
  },
});
