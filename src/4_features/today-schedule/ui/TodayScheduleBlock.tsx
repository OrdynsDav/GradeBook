import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Typography } from '@shared/ui';
import { useTheme } from '@shared/lib';
import type { LessonItem } from '@shared/lib/api';
import { ScheduleItem } from './ScheduleItem';

interface TodayScheduleBlockProps {
  lessons: LessonItem[];
  weekdayLabel: string;
}

const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Moscow',
  });

export const TodayScheduleBlock: React.FC<TodayScheduleBlockProps> = ({
  lessons,
  weekdayLabel,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Typography variant="h4">Расписание на сегодня</Typography>
        <Typography variant="caption" color="secondary">
          {weekdayLabel}
        </Typography>
      </View>
      <Card padding="sm">
        {lessons.length > 0 ? (
          lessons.map((item, index) => (
            <ScheduleItem
              key={item.id}
              time={`${formatTime(item.startsAt)} - ${formatTime(item.endsAt)}`}
              subject={item.subject.name}
              room={item.room ?? ''}
              isLast={index === lessons.length - 1}
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
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptySchedule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
});
