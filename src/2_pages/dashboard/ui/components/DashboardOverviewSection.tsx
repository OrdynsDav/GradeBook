import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Typography } from '@shared/ui';
import { spacing, type ThemeColors } from '@shared/config/theme';
import { withAlpha } from '@shared/lib/utils';

interface QuickStatProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
  isDark: boolean;
}

const QuickStat: React.FC<QuickStatProps> = ({ icon, label, value, color, isDark }) => (
  <Card style={styles.statCard}>
    <View
      style={[
        styles.statIconContainer,
        { backgroundColor: withAlpha(color, isDark ? '36' : '20') },
      ]}
    >
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Typography variant="h3" align="center">
      {value}
    </Typography>
    <Typography variant="caption" color="secondary" align="center">
      {label}
    </Typography>
  </Card>
);

interface DashboardOverviewSectionProps {
  firstName?: string;
  subtitle?: string;
  averageGrade: string;
  fivesCount: string;
  lessonsToday: string;
  unreadNotifications: string;
  isDark: boolean;
  tablet: boolean;
  colors: ThemeColors;
}

export const DashboardOverviewSection: React.FC<DashboardOverviewSectionProps> = ({
  firstName,
  subtitle,
  averageGrade,
  fivesCount,
  lessonsToday,
  unreadNotifications,
  isDark,
  tablet,
  colors,
}) => {
  const primaryAccent = isDark ? colors.primary.light : colors.primary.main;
  const secondaryAccent = isDark ? colors.secondary.light : colors.secondary.main;

  return (
    <>
      <View style={styles.greeting}>
        <Typography variant="h3">Привет, {firstName ?? 'Студент'}! 👋</Typography>
        {subtitle ? (
          <Typography variant="body2" color="secondary">
            {subtitle}
          </Typography>
        ) : null}
      </View>

      <View style={[styles.statsContainer, tablet && styles.statsContainerTablet]}>
        <QuickStat
          icon="star"
          label="Средний балл"
          value={averageGrade}
          color={secondaryAccent}
          isDark={isDark}
        />
        <QuickStat
          icon="checkmark-circle"
          label="Пятёрок"
          value={fivesCount}
          color={colors.grades.excellent}
          isDark={isDark}
        />
        <QuickStat
          icon="calendar"
          label="Пар сегодня"
          value={lessonsToday}
          color={primaryAccent}
          isDark={isDark}
        />
        <QuickStat
          icon="notifications"
          label="Уведомлений"
          value={unreadNotifications}
          color={colors.status.info}
          isDark={isDark}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  greeting: {
    marginBottom: spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statsContainerTablet: {
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: spacing.md,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
});
