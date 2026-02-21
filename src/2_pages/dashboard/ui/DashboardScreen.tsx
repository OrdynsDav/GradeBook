import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, Typography, Card } from '@shared/ui';
import { spacing } from '@shared/config/theme';
import { WEEK_SCHEDULE } from '@shared/config/schedule';
import { useTheme } from '@shared/lib';
import { useAuthStore } from '@entities/user';
import { useCalendarStore } from '@entities/calendar';
import { isTablet } from '@shared/lib/responsive';

interface QuickStatProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
  isDark: boolean;
}

const withAlpha = (hexColor: string, alphaHex: string): string => `${hexColor}${alphaHex}`;

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

interface ScheduleItemProps {
  time: string;
  subject: string;
  room: string;
  isLast?: boolean;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({
  time,
  subject,
  room,
  isLast,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.scheduleItem,
        { borderBottomColor: theme.colors.border.light },
        isLast && styles.scheduleItemLast,
      ]}
    >
      <View style={styles.scheduleTime}>
        <Typography variant="body2" color="secondary">
          {time}
        </Typography>
      </View>
      <View style={styles.scheduleContent}>
        <Typography variant="body1" color="primary">
          {subject}
        </Typography>
        <Typography variant="caption" color="secondary">
          Кабинет {room}
        </Typography>
      </View>
    </View>
  );
};

const RECENT_GRADES = [
  { subject: 'Математика', grade: 5, date: 'Сегодня' },
  { subject: 'Русский язык', grade: 4, date: 'Вчера' },
  { subject: 'Физика', grade: 5, date: 'Вчера' },
  { subject: 'История', grade: 4, date: '18.02' },
];

export const DashboardScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const user = useAuthStore((state) => state.user);
  const today = useCalendarStore((state) => state.today);
  const refreshToday = useCalendarStore((state) => state.refreshToday);
  const tablet = isTablet();
  const primaryAccent = isDark ? theme.colors.primary.light : theme.colors.primary.main;
  const secondaryAccent = isDark ? theme.colors.secondary.light : theme.colors.secondary.main;
  const todayLessons = useMemo(
    () => (today.workingDayIndex === null ? [] : WEEK_SCHEDULE[today.workingDayIndex] || []),
    [today.workingDayIndex]
  );

  useEffect(() => {
    refreshToday();
  }, [refreshToday]);

  return (
    <ScreenContainer scrollable>
      <View style={styles.greeting}>
        <Typography variant="h3">
          Привет, {user?.firstName}! 👋
        </Typography>
        <Typography variant="body2" color="secondary">
          Группа {user?.className}
        </Typography>
      </View>

      <View style={[styles.statsContainer, tablet && styles.statsContainerTablet]}>
        <QuickStat
          icon="star"
          label="Средний балл"
          value="4.5"
          color={secondaryAccent}
          isDark={isDark}
        />
        <QuickStat
          icon="checkmark-circle"
          label="Пятёрок"
          value="12"
          color={theme.colors.grades.excellent}
          isDark={isDark}
        />
        <QuickStat
          icon="calendar"
          label="Пар сегодня"
          value={String(todayLessons.length)}
          color={primaryAccent}
          isDark={isDark}
        />
        <QuickStat
          icon="notifications"
          label="Уведомлений"
          value="3"
          color={theme.colors.status.info}
          isDark={isDark}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Typography variant="h4">Расписание на сегодня</Typography>
          <Typography variant="caption" color="secondary">
            {today.weekdayFull}
          </Typography>
        </View>
        <Card padding="sm">
          {todayLessons.length > 0 ? (
            todayLessons.map((item, index) => (
              <ScheduleItem
                key={item.id}
                time={item.time}
                subject={item.subject}
                room={item.room}
                isLast={index === todayLessons.length - 1}
              />
            ))
          ) : (
            <View style={styles.emptySchedule}>
              <Ionicons name="calendar-clear-outline" size={22} color={theme.colors.text.secondary} />
              <Typography variant="body2" color="secondary">
                Сегодня занятий нет
              </Typography>
            </View>
          )}
        </Card>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Typography variant="h4">Последние оценки</Typography>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.gradesRow}>
            {RECENT_GRADES.map((item, index) => (
              <Card key={index} style={styles.gradeCard}>
                <View
                  style={[
                    styles.gradeValue,
                    {
                      backgroundColor:
                        item.grade === 5
                          ? theme.colors.grades.excellent
                          : theme.colors.grades.good,
                    },
                  ]}
                >
                  <Typography variant="h3" color="light">
                    {item.grade}
                  </Typography>
                </View>
                <Typography variant="body2" numberOfLines={1}>
                  {item.subject}
                </Typography>
                <Typography variant="caption" color="secondary">
                  {item.date}
                </Typography>
              </Card>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
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
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  scheduleItem: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  scheduleItemLast: {
    borderBottomWidth: 0,
  },
  scheduleTime: {
    width: 60,
    justifyContent: 'center',
  },
  scheduleContent: {
    flex: 1,
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
