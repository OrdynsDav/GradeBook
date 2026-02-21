import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, Typography, Card } from '../../../shared/ui';
import { colors, spacing, borderRadius } from '../../../shared/config/theme';
import { WEEKDAYS, WEEKDAYS_SHORT } from '../../../shared/config/constants';

interface Lesson {
  id: string;
  number: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

type WeekSchedule = Record<number, Lesson[]>;

const mockSchedule: WeekSchedule = {
  0: [
    { id: '1', number: 1, time: '08:30 - 09:15', subject: 'Математика', teacher: 'Петрова А.И.', room: '301' },
    { id: '2', number: 2, time: '09:25 - 10:10', subject: 'Русский язык', teacher: 'Сидорова М.П.', room: '205' },
    { id: '3', number: 3, time: '10:30 - 11:15', subject: 'Физика', teacher: 'Козлов В.А.', room: '312' },
    { id: '4', number: 4, time: '11:25 - 12:10', subject: 'История', teacher: 'Иванов С.С.', room: '108' },
    { id: '5', number: 5, time: '12:30 - 13:15', subject: 'Английский язык', teacher: 'Смирнова Е.В.', room: '215' },
  ],
  1: [
    { id: '6', number: 1, time: '08:30 - 09:15', subject: 'Химия', teacher: 'Новикова О.Н.', room: '310' },
    { id: '7', number: 2, time: '09:25 - 10:10', subject: 'Биология', teacher: 'Морозова Л.К.', room: '302' },
    { id: '8', number: 3, time: '10:30 - 11:15', subject: 'География', teacher: 'Волкова Н.А.', room: '201' },
    { id: '9', number: 4, time: '11:25 - 12:10', subject: 'Математика', teacher: 'Петрова А.И.', room: '301' },
    { id: '10', number: 5, time: '12:30 - 13:15', subject: 'Литература', teacher: 'Сидорова М.П.', room: '205' },
    { id: '11', number: 6, time: '13:25 - 14:10', subject: 'ОБЖ', teacher: 'Кузнецов П.В.', room: '101' },
  ],
  2: [
    { id: '12', number: 1, time: '08:30 - 09:15', subject: 'Английский язык', teacher: 'Смирнова Е.В.', room: '215' },
    { id: '13', number: 2, time: '09:25 - 10:10', subject: 'Информатика', teacher: 'Павлов Д.С.', room: '401' },
    { id: '14', number: 3, time: '10:30 - 11:15', subject: 'Физика', teacher: 'Козлов В.А.', room: '312' },
    { id: '15', number: 4, time: '11:25 - 12:10', subject: 'Математика', teacher: 'Петрова А.И.', room: '301' },
    { id: '16', number: 5, time: '12:30 - 13:15', subject: 'Физкультура', teacher: 'Соколов И.М.', room: 'Спортзал' },
  ],
  3: [
    { id: '17', number: 1, time: '08:30 - 09:15', subject: 'Русский язык', teacher: 'Сидорова М.П.', room: '205' },
    { id: '18', number: 2, time: '09:25 - 10:10', subject: 'История', teacher: 'Иванов С.С.', room: '108' },
    { id: '19', number: 3, time: '10:30 - 11:15', subject: 'Обществознание', teacher: 'Иванов С.С.', room: '108' },
    { id: '20', number: 4, time: '11:25 - 12:10', subject: 'Химия', teacher: 'Новикова О.Н.', room: '310' },
    { id: '21', number: 5, time: '12:30 - 13:15', subject: 'Математика', teacher: 'Петрова А.И.', room: '301' },
  ],
  4: [
    { id: '22', number: 1, time: '08:30 - 09:15', subject: 'Литература', teacher: 'Сидорова М.П.', room: '205' },
    { id: '23', number: 2, time: '09:25 - 10:10', subject: 'Биология', teacher: 'Морозова Л.К.', room: '302' },
    { id: '24', number: 3, time: '10:30 - 11:15', subject: 'Английский язык', teacher: 'Смирнова Е.В.', room: '215' },
    { id: '25', number: 4, time: '11:25 - 12:10', subject: 'Физика', teacher: 'Козлов В.А.', room: '312' },
    { id: '26', number: 5, time: '12:30 - 13:15', subject: 'Физкультура', teacher: 'Соколов И.М.', room: 'Спортзал' },
  ],
  5: [
    { id: '27', number: 1, time: '08:30 - 09:15', subject: 'Математика', teacher: 'Петрова А.И.', room: '301' },
    { id: '28', number: 2, time: '09:25 - 10:10', subject: 'География', teacher: 'Волкова Н.А.', room: '201' },
    { id: '29', number: 3, time: '10:30 - 11:15', subject: 'Информатика', teacher: 'Павлов Д.С.', room: '401' },
  ],
};

interface LessonCardProps {
  lesson: Lesson;
  isActive?: boolean;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, isActive }) => (
  <Card
    style={[styles.lessonCard, isActive && styles.lessonCardActive]}
    variant={isActive ? 'elevated' : 'outlined'}
  >
    <View style={[styles.lessonNumber, {display: 'flex'}]}>
      <View
        style={[
          styles.numberBadge,
          { backgroundColor: isActive ? colors.primary.main : colors.background.default },
        ]}
      >
        <Typography
          variant="body1"
          color={isActive ? 'light' : 'secondary'}
          style={{ fontWeight: '600' }}
        >
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
          <Ionicons name="person-outline" size={14} color={colors.text.secondary} />
          <Typography variant="caption" color="secondary">
            {lesson.teacher}
          </Typography>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={14} color={colors.text.secondary} />
          <Typography variant="caption" color="secondary">
            {lesson.room}
          </Typography>
        </View>
      </View>
    </View>
  </Card>
);

export const ScheduleScreen: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const lessons = mockSchedule[selectedDay] || [];

  return (
    <ScreenContainer padding={false}>
      <View style={styles.weekSelector}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekDays}
        >
          {WEEKDAYS_SHORT.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayButton,
                selectedDay === index && styles.dayButtonActive,
              ]}
              onPress={() => setSelectedDay(index)}
            >
              <Typography
                variant="caption"
                color={selectedDay === index ? 'light' : 'secondary'}
              >
                {day}
              </Typography>
              <Typography
                variant="body1"
                color={selectedDay === index ? 'light' : 'primary'}
                style={{ fontWeight: '600' }}
              >
                {17 + index}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.dayHeader}>
        <Typography variant="h4">{WEEKDAYS[selectedDay]}</Typography>
        <Typography variant="body2" color="secondary">
          {lessons.length} {lessons.length === 1 ? 'урок' : lessons.length < 5 ? 'урока' : 'уроков'}
        </Typography>
      </View>

      <ScrollView
        contentContainerStyle={styles.lessonsContainer}
        showsVerticalScrollIndicator={false}
      >
        {lessons.length > 0 ? (
          lessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              isActive={selectedDay === 0 && index === 2}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={colors.text.disabled} />
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
    backgroundColor: colors.background.paper,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
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
    backgroundColor: colors.background.default,
  },
  dayButtonActive: {
    backgroundColor: colors.primary.main,
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
  },
  lessonCardActive: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.main,
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
