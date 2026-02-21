import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, Typography, Card } from '../../../shared/ui';
import { colors, spacing } from '../../../shared/config/theme';
import { useAuthStore } from '../../../entities/user';
import { isTablet } from '../../../shared/lib/responsive';

interface QuickStatProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
}

const QuickStat: React.FC<QuickStatProps> = ({ icon, label, value, color }) => (
  <Card style={styles.statCard}>
    <View style={[styles.statIconContainer, { backgroundColor: `${color}20` }]}>
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
}) => (
  <View style={[styles.scheduleItem, isLast && styles.scheduleItemLast]}>
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

export const DashboardScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const tablet = isTablet();

  const todaySchedule = [
    { time: '08:30', subject: 'Математика', room: '301' },
    { time: '09:20', subject: 'Русский язык', room: '205' },
    { time: '10:20', subject: 'Физика', room: '312' },
    { time: '11:10', subject: 'История', room: '108' },
    { time: '12:10', subject: 'Английский язык', room: '215' },
  ];

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
          color={colors.secondary.main}
        />
        <QuickStat
          icon="checkmark-circle"
          label="Пятёрок"
          value="12"
          color={colors.grades.excellent}
        />
        <QuickStat
          icon="calendar"
          label="Уроков сегодня"
          value="5"
          color={colors.primary.main}
        />
        <QuickStat
          icon="notifications"
          label="Уведомлений"
          value="3"
          color={colors.status.info}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Typography variant="h4">Расписание на сегодня</Typography>
          <Typography variant="caption" color="secondary">
            Понедельник
          </Typography>
        </View>
        <Card padding="sm">
          {todaySchedule.map((item, index) => (
            <ScheduleItem
              key={index}
              time={item.time}
              subject={item.subject}
              room={item.room}
              isLast={index === todaySchedule.length - 1}
            />
          ))}
        </Card>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Typography variant="h4">Последние оценки</Typography>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.gradesRow}>
            {[
              { subject: 'Математика', grade: 5, date: 'Сегодня' },
              { subject: 'Русский язык', grade: 4, date: 'Вчера' },
              { subject: 'Физика', grade: 5, date: 'Вчера' },
              { subject: 'История', grade: 4, date: '18.02' },
            ].map((item, index) => (
              <Card key={index} style={styles.gradeCard}>
                <View
                  style={[
                    styles.gradeValue,
                    {
                      backgroundColor:
                        item.grade === 5
                          ? colors.grades.excellent
                          : colors.grades.good,
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
    borderBottomColor: colors.border.light,
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
