import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isSameDay } from 'date-fns';
import { ScreenContainer, Typography } from '@shared/ui';
import { spacing, borderRadius } from '@shared/config/theme';
import { useTheme } from '@shared/lib';
import { useDaySchedule } from '../model/useDaySchedule';
import { LessonCard } from './LessonCard';

export const DayScheduleView: React.FC = () => {
  const { theme, isDark } = useTheme();
  const {
    calendarWeek,
    selectedDayIndex,
    setSelectedDay,
    selectedCalendarDay,
    lessons,
    isLoading,
    error,
    todayDate,
  } = useDaySchedule();

  const sortedLessons = [...lessons].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );

  const lessonCountLabel =
    lessons.length === 1
      ? 'урок'
      : lessons.length < 5
        ? 'урока'
        : 'уроков';

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
            const isSelected = selectedDayIndex === day.index;
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
                onPress={() => setSelectedDay(day.index)}
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
          {lessons.length} {lessonCountLabel}
        </Typography>
      </View>

      <ScrollView
        contentContainerStyle={styles.lessonsContainer}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
            <Typography variant="body2" color="secondary">
              Загрузка расписания...
            </Typography>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle-outline" size={48} color={theme.colors.status.error} />
            <Typography variant="h4" color="secondary" align="center">
              Ошибка загрузки
            </Typography>
            <Typography variant="body2" color="secondary" align="center">
              {error}
            </Typography>
          </View>
        ) : sortedLessons.length > 0 ? (
          sortedLessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              lessonNumber={index + 1}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={theme.colors.text.disabled} />
            <Typography variant="h4" color="secondary" align="center">
              Нет уроков
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
});
