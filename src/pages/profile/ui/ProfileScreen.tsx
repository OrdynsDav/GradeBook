import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, Typography, Card, Button } from '../../../shared/ui';
import { colors, spacing, borderRadius } from '../../../shared/config/theme';
import { useAuthStore } from '../../../entities/user';
import { ProfileStackParamList } from '../../../app/navigation/types';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'ProfileMain'>;

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
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIcon}>
      <Ionicons name={icon} size={24} color={colors.primary.main} />
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
      {showBadge && badgeCount && badgeCount > 0 && (
        <View style={styles.badge}>
          <Typography variant="caption" color="light">
            {badgeCount}
          </Typography>
        </View>
      )}
      <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
    </View>
  </TouchableOpacity>
);

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuthStore();

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

  return (
    <ScreenContainer scrollable>
      <Card style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={colors.primary.main} />
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
          onPress={() => navigation.navigate('Notifications')}
          showBadge
          badgeCount={3}
        />
        <View style={styles.menuDivider} />
        <MenuItem
          icon="settings-outline"
          title="Настройки"
          subtitle="Уведомления, тема, язык"
          onPress={() => {}}
        />
        <View style={styles.menuDivider} />
        <MenuItem
          icon="help-circle-outline"
          title="Помощь"
          subtitle="FAQ, поддержка"
          onPress={() => navigation.navigate('Help')}
        />
        <View style={styles.menuDivider} />
        <MenuItem
          icon="information-circle-outline"
          title="О приложении"
          subtitle="Версия 1.0.0"
          onPress={() => navigation.navigate('AboutApp')}
        />
      </Card>

      <Card style={styles.statsCard}>
        <Typography variant="h4" style={styles.statsTitle}>
          Статистика за семестр
        </Typography>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Typography variant="h2" style={{ color: colors.grades.excellent }}>
              24
            </Typography>
            <Typography variant="caption" color="secondary">
              Пятёрок
            </Typography>
          </View>
          <View style={styles.statItem}>
            <Typography variant="h2" style={{ color: colors.grades.good }}>
              18
            </Typography>
            <Typography variant="caption" color="secondary">
              Четвёрок
            </Typography>
          </View>
          <View style={styles.statItem}>
            <Typography variant="h2" style={{ color: colors.grades.satisfactory }}>
              5
            </Typography>
            <Typography variant="caption" color="secondary">
              Троек
            </Typography>
          </View>
          <View style={styles.statItem}>
            <Typography variant="h2" style={{ color: colors.primary.main }}>
              98%
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
        style={styles.logoutButton}
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
    backgroundColor: `${colors.primary.main}20`,
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
    backgroundColor: `${colors.primary.main}10`,
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
    backgroundColor: colors.border.light,
    marginLeft: 72,
  },
  badge: {
    backgroundColor: colors.status.error,
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
