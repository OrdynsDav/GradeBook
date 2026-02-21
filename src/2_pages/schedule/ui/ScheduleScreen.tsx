import React, { useState, useCallback, memo, useMemo, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addDays, format, isSameDay, parseISO, startOfWeek } from 'date-fns';
import { ScreenContainer, Typography, Card } from '@shared/ui';
import { spacing, borderRadius } from '@shared/config/theme';
import { WEEK_SCHEDULE, type Lesson } from '@shared/config/schedule';
import { useTheme } from '@shared/lib';
import { useCalendarStore } from '@entities/calendar';

interface WorkingDay {
  index: number;
  date: Date;
  isoDate: string;
  shortLabel: string;
  fullLabel: string;
  dayOfMonth: string;
  isDisabled: boolean;
}

const WEEKDAY_SHORT_LABELS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'] as const;
const WEEKDAY_FULL_LABELS = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье',
] as const;

const buildCalendarWeek = (referenceDate: Date): WorkingDay[] => {
  const monday = startOfWeek(referenceDate, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(monday, index);
    const isDisabled = index > 4;

    return {
      index,
      date,
      isoDate: format(date, 'yyyy-MM-dd'),
      shortLabel: WEEKDAY_SHORT_LABELS[index],
      fullLabel: WEEKDAY_FULL_LABELS[index],
      dayOfMonth: format(date, 'd'),
      isDisabled,
    };
  });
};

interface LessonCardProps {
  lesson: Lesson;
}

const LessonCard: React.FC<LessonCardProps> = memo(({ lesson }) => {
  const { theme } = useTheme();

  return (
    <Card
      style={[styles.lessonCard, { borderLeftColor: theme.colors.border.light }]}
      variant="outlined"
    >
      <View style={[styles.lessonNumber, { display: 'flex' }]}>
        <View style={[styles.numberBadge, { backgroundColor: theme.colors.background.default }]}>
          <Typography variant="body1" color="secondary" style={{ fontWeight: '600' }}>
            {lesson.number}
          </Typography>
        </View>
        <Typography variant="caption" color="secondary">
          {lesson.time}
        </Typography>
      </View>
      <View style={styles.lessonContent}>
        <Typography variant="h4">{lesson.subject}</Typography>
        <View style={styles.lessonMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="person-outline" size={14} color={theme.colors.text.secondary} />
            <Typography variant="caption" color="secondary">
              {lesson.teacher}
            </Typography>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color={theme.colors.text.secondary} />
            <Typography variant="caption" color="secondary">
              {lesson.room}
            </Typography>
          </View>
        </View>
      </View>
    </Card>
  );
});

LessonCard.displayName = 'LessonCard';

export const ScheduleScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const today = useCalendarStore((state) => state.today);
  const refreshToday = useCalendarStore((state) => state.refreshToday);

  useEffect(() => {
    refreshToday();
  }, [refreshToday]);

  const todayDate = useMemo(() => parseISO(today.isoDate), [today.isoDate]);
  const calendarWeek = useMemo(() => buildCalendarWeek(todayDate), [todayDate]);
  const todayCalendarIndex = useMemo(() => {
    const index = calendarWeek.findIndex((day) => isSameDay(day.date, todayDate));
    return index >= 0 ? index : 0;
  }, [calendarWeek, todayDate]);

  const [selectedDay, setSelectedDay] = useState(todayCalendarIndex);

  useEffect(() => {
    setSelectedDay(todayCalendarIndex);
  }, [todayCalendarIndex]);

  const selectedCalendarDay = calendarWeek[selectedDay] ?? calendarWeek[0];
  const lessons = selectedCalendarDay ? WEEK_SCHEDULE[selectedCalendarDay.index] || [] : [];

  const handleDaySelect = useCallback((index: number) => {
    setSelectedDay(index);
  }, []);

  return (
    <ScreenContainer padding={false}>
      <View
        style={[
          styles.weekSelector,
          {
            backgroundColor: theme.colors.background.paper,
            borderBottomColor: theme.colors.border.light,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekDays}
        >
          {calendarWeek.map((day) => {
            const isSelected = selectedDay === day.index;
            const isToday = isSameDay(day.date, todayDate);
            const isWeekendSelected = day.isDisabled && isSelected;

            return (
              <TouchableOpacity
                key={day.isoDate}
                activeOpacity={0.7}
                style={[
                  styles.dayButton,
                  {
                    backgroundColor: theme.colors.background.default,
                    borderColor: theme.colors.border.light,
                  },
                  isWeekendSelected && {
                    backgroundColor: `${theme.colors.primary.main}${isDark ? '14' : '08'}`,
                    borderColor: theme.colors.primary.main,
                  },
                  isToday &&
                    !isSelected &&
                    !day.isDisabled && {
                      borderColor: theme.colors.primary.light,
                      backgroundColor: `${theme.colors.primary.main}1A`,
                    },
                  isSelected &&
                    !day.isDisabled && {
                    backgroundColor: theme.colors.primary.main,
                    borderColor: theme.colors.primary.main,
                  },
                  day.isDisabled && !isSelected && styles.dayButtonDisabled,
                ]}
                onPress={() => handleDaySelect(day.index)}
              >
                <Typography
                  variant="caption"
                  color={
                    isWeekendSelected
                      ? 'primary'
                      : day.isDisabled
                        ? 'disabled'
                        : isSelected
                          ? 'light'
                          : isToday
                            ? 'primary'
                            : 'secondary'
                  }
                >
                  {day.shortLabel}
                </Typography>
                <Typography
                  variant="body1"
                  color={
                    isWeekendSelected
                      ? 'primary'
                      : day.isDisabled
                        ? 'disabled'
                        : isSelected
                          ? 'light'
                          : isToday
                            ? 'primary'
                            : 'primary'
                  }
                  style={{ fontWeight: '600' }}
                >
                  {day.dayOfMonth}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.dayHeader}>
        <Typography variant="h4">{selectedCalendarDay?.fullLabel ?? ''}</Typography>
        <Typography variant="body2" color="secondary">
          {lessons.length} {lessons.length === 1 ? 'урок' : lessons.length < 5 ? 'урока' : 'уроков'}
        </Typography>
      </View>

      <ScrollView
        contentContainerStyle={styles.lessonsContainer}
        showsVerticalScrollIndicator={false}
      >
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={theme.colors.text.disabled} />
            <Typography variant="h4" color="secondary" align="center">
              Нет пар
            </Typography>
            <Typography variant="body2" color="disabled" align="center">
              В этот день занятий нет
            </Typography>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  weekSelector: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  weekDays: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  dayButton: {
    width: 48,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  dayButtonDisabled: {
    opacity: 0.45,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  lessonsContainer: {
    padding: spacing.md,
    paddingTop: 0,
    gap: spacing.sm,
  },
  lessonCard: {
    flexDirection: 'row',
    borderLeftWidth: 1,
  },
  lessonNumber: {
    marginRight: spacing.md,
    width: 60,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  lessonContent: {
    flex: 1,
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
});
