import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, Typography, Card, Button } from '@shared/ui';
import { spacing } from '@shared/config/theme';
import { useTheme } from '@shared/lib';
import { DashboardApi, getApiErrorMessage, type DashboardResponse } from '@shared/lib/api';
import { useAuthStore } from '@entities/user';
import { useCalendarStore } from '@entities/calendar';
import { useGradesStore, getComputedFromStore } from '@entities/grades';
import { isTablet } from '@shared/lib/responsive';
import { withAlpha } from '@shared/lib/utils';
import { TodayScheduleBlock } from '@features/today-schedule';

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

export const DashboardScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const user = useAuthStore((state) => state.user);
  const today = useCalendarStore((state) => state.today);
  const refreshToday = useCalendarStore((state) => state.refreshToday);
  const tablet = isTablet();
  const gradesBySubject = useGradesStore((s) => s.gradesBySubject);
  const gradesComputed = getComputedFromStore(gradesBySubject);
  const primaryAccent = isDark ? theme.colors.primary.light : theme.colors.primary.main;
  const secondaryAccent = isDark ? theme.colors.secondary.light : theme.colors.secondary.main;

  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await DashboardApi.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Dashboard load failed:', error);
      setError(getApiErrorMessage(error, 'Ошибка загрузки данных'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshToday();
    loadDashboardData();
  }, [refreshToday]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primaryAccent} />
          <Typography variant="body1" color="secondary">
            Загрузка...
          </Typography>
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.colors.status.error} />
          <Typography variant="h4" color="secondary" align="center">
            Ошибка загрузки
          </Typography>
          <Typography variant="body2" color="secondary" align="center">
            {error}
          </Typography>
          <Button
            title="Повторить"
            onPress={loadDashboardData}
            variant="outline"
            style={styles.retryButton}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <View style={styles.greeting}>
        <Typography variant="h3">
          Привет, {user?.firstName}! 👋
        </Typography>
        <Typography variant="body2" color="secondary">
          Группа {user?.className || user?.classRoom?.name}
        </Typography>
      </View>

      <View style={[styles.statsContainer, tablet && styles.statsContainerTablet]}>
        <QuickStat
          icon="star"
          label="Средний балл"
          value={dashboardData?.averageGrade != null ? dashboardData.averageGrade.toFixed(1) : '—'}
          color={secondaryAccent}
          isDark={isDark}
        />
        <QuickStat
          icon="checkmark-circle"
          label="Пятёрок"
          value={String(gradesComputed.fivesCount)}
          color={theme.colors.grades.excellent}
          isDark={isDark}
        />
        <QuickStat
          icon="calendar"
          label="Уроков сегодня"
          value={String(dashboardData?.lessonsToday || 0)}
          color={primaryAccent}
          isDark={isDark}
        />
        <QuickStat
          icon="notifications"
          label="Уведомлений"
          value={String(dashboardData?.unreadNotifications || 0)}
          color={theme.colors.status.info}
          isDark={isDark}
        />
      </View>

      <TodayScheduleBlock
        lessons={dashboardData?.todaySchedule ?? []}
        weekdayLabel={today.weekdayFull}
      />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Typography variant="h4">Последние оценки</Typography>
        </View>
        <Card padding="sm">
          <View style={styles.emptySchedule}>
            <Ionicons name="school-outline" size={22} color={theme.colors.text.secondary} />
            <Typography variant="body2" color="secondary">
              Загружается...
            </Typography>
          </View>
        </Card>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  retryButton: {
    marginTop: spacing.sm,
  },
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
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  emptySchedule: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  gradesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingRight: spacing.md,
    paddingBottom: spacing.md,
  },
  gradeCard: {
    width: 100,
    alignItems: 'center',
  },
  gradeValue: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
});
