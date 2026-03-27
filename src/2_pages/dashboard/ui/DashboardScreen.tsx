import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, Typography, Button } from '@shared/ui';
import { spacing } from '@shared/config/theme';
import { useTheme, useThrottledRefresh } from '@shared/lib';
import {
  DashboardApi,
  getApiErrorMessage,
  type DashboardResponse,
} from '@shared/lib/api';
import { useAuthStore } from '@entities/user';
import { useCalendarStore } from '@entities/calendar';
import { useGradesStore, getComputedFromStore } from '@entities/grades';
import { isTablet } from '@shared/lib/responsive';
import { buildRecentGradeRows } from '../lib/recentGrades';
import {
  DashboardOverviewSection,
  DashboardTodayScheduleSection,
  DashboardRecentGradesSection,
  DashboardSkeleton,
} from './components';

export const DashboardScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const user = useAuthStore((state) => state.user);
  const today = useCalendarStore((state) => state.today);
  const refreshToday = useCalendarStore((state) => state.refreshToday);
  const tablet = isTablet();
  const gradesBySubject = useGradesStore((s) => s.gradesBySubject);
  const gradesSubjects = useGradesStore((s) => s.subjects);
  const gradesIsLoading = useGradesStore((s) => s.isLoading);
  const loadAllGrades = useGradesStore((s) => s.loadAll);
  const forceRefreshGrades = useGradesStore((s) => s.forceRefreshAll);
  const gradesComputed = getComputedFromStore(gradesBySubject);

  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await DashboardApi.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Dashboard load failed:', err);
      setError(getApiErrorMessage(err, 'Ошибка загрузки данных'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const recentGradeRows = useMemo(
    () => buildRecentGradeRows(gradesSubjects, gradesBySubject, 5),
    [gradesSubjects, gradesBySubject]
  );

  useEffect(() => {
    refreshToday();
    void loadDashboardData();
    void loadAllGrades();
  }, [refreshToday, loadDashboardData, loadAllGrades]);

  const refreshAction = useCallback(async () => {
    refreshToday();
    await Promise.all([loadDashboardData(), forceRefreshGrades()]);
  }, [refreshToday, loadDashboardData, forceRefreshGrades]);

  const [refreshing, handleRefresh] = useThrottledRefresh(refreshAction);

  if (isLoading) {
    return <DashboardSkeleton />;
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
            onPress={() => {
              void loadDashboardData();
              void forceRefreshGrades();
            }}
            variant="outline"
            style={styles.retryButton}
          />
        </View>
      </ScreenContainer>
    );
  }
  const groupLabel = user?.group?.groupName;
  const subtitle =
    user?.role == 'student' ? (groupLabel ? `Группа ${groupLabel}` : `Группа ${user?.group?.groupName}`) : '';

  return (
    <ScreenContainer scrollable onRefresh={handleRefresh} refreshing={refreshing}>
      <DashboardOverviewSection
        firstName={user?.firstName}
        subtitle={subtitle}
        averageGrade={dashboardData?.averageGrade != null ? dashboardData.averageGrade.toFixed(1) : '—'}
        fivesCount={String(gradesComputed.fivesCount)}
        lessonsToday={String(dashboardData?.lessonsToday || 0)}
        unreadNotifications={String(dashboardData?.unreadNotifications || 0)}
        isDark={isDark}
        tablet={tablet}
        colors={theme.colors}
      />

      <DashboardTodayScheduleSection
        lessons={dashboardData?.todaySchedule ?? []}
        weekdayLabel={today.weekdayFull}
      />

      <DashboardRecentGradesSection
        colors={theme.colors}
        isLoading={gradesIsLoading && gradesSubjects.length === 0}
        items={recentGradeRows}
      />
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
});
