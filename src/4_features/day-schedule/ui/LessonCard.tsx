import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Typography } from '@shared/ui';
import { spacing } from '@shared/config/theme';
import { useTheme } from '@shared/lib';
import type { LessonItem } from '@shared/lib/api';

interface LessonCardProps {
  lesson: LessonItem;
  lessonNumber?: number;
}

export const LessonCard: React.FC<LessonCardProps> = memo(({ lesson, lessonNumber }) => {
  const { theme } = useTheme();

  const startTime = new Date(lesson.startsAt).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Moscow',
  });
  const endTime = new Date(lesson.endsAt).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Moscow',
  });
  const timeRange = `${startTime} - ${endTime}`;
  const teacherName = `${lesson.teacher.lastName} ${lesson.teacher.firstName.charAt(0)}.${
    lesson.teacher.middleName ? lesson.teacher.middleName.charAt(0) + '.' : ''
  }`;

  return (
    <Card
      style={[styles.lessonCard, { borderLeftColor: theme.colors.border.light }]}
      variant="outlined"
    >
      <View style={[styles.lessonNumber, { display: 'flex' }]}>
        <View
          style={[styles.numberBadge, { backgroundColor: theme.colors.background.default }]}
        >
          <Typography variant="body1" color="secondary" style={{ fontWeight: '600' }}>
            {lessonNumber ?? '—'}
          </Typography>
        </View>
        <Typography variant="caption" color="secondary">
          {timeRange}
        </Typography>
      </View>
      <View style={styles.lessonContent}>
        <Typography variant="h4">{lesson.subject.name}</Typography>
        <View style={styles.lessonMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="person-outline" size={14} color={theme.colors.text.secondary} />
            <Typography variant="caption" color="secondary">
              {teacherName}
            </Typography>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color={theme.colors.text.secondary} />
            <Typography variant="caption" color="secondary">
              {lesson.room ?? '—'}
            </Typography>
          </View>
        </View>
      </View>
    </Card>
  );
});

LessonCard.displayName = 'LessonCard';

const styles = StyleSheet.create({
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
});
