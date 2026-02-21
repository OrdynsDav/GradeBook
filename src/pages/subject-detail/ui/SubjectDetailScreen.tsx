import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ScreenContainer, Typography, Card } from '../../../shared/ui';
import { colors, spacing, borderRadius } from '../../../shared/config/theme';

interface GradeEntry {
  id: string;
  grade: number;
  date: string;
  type: string;
  comment?: string;
}

const mockGrades: GradeEntry[] = [
  { id: '1', grade: 5, date: '20.02.2026', type: 'Контрольная работа', comment: 'Отлично!' },
  { id: '2', grade: 4, date: '18.02.2026', type: 'Домашняя работа' },
  { id: '3', grade: 5, date: '15.02.2026', type: 'Ответ на уроке' },
  { id: '4', grade: 4, date: '13.02.2026', type: 'Самостоятельная работа' },
  { id: '5', grade: 5, date: '10.02.2026', type: 'Домашняя работа' },
  { id: '6', grade: 5, date: '08.02.2026', type: 'Контрольная работа', comment: 'Молодец!' },
  { id: '7', grade: 4, date: '05.02.2026', type: 'Ответ на уроке' },
  { id: '8', grade: 5, date: '03.02.2026', type: 'Домашняя работа' },
];

const getGradeColor = (grade: number): string => {
  if (grade === 5) return colors.grades.excellent;
  if (grade === 4) return colors.grades.good;
  if (grade === 3) return colors.grades.satisfactory;
  return colors.grades.poor;
};

const getGradeLabel = (grade: number): string => {
  if (grade === 5) return 'Отлично';
  if (grade === 4) return 'Хорошо';
  if (grade === 3) return 'Удовлетворительно';
  return 'Неудовлетворительно';
};

interface GradeCardProps {
  entry: GradeEntry;
}

const GradeCard: React.FC<GradeCardProps> = ({ entry }) => (
  <Card style={styles.gradeCard}>
    <View style={styles.gradeContent}>
      <View
        style={[
          styles.gradeBadge,
          { backgroundColor: getGradeColor(entry.grade) },
        ]}
      >
        <Typography variant="h3" color="light">
          {entry.grade}
        </Typography>
      </View>
      <View style={styles.gradeInfo}>
        <Typography variant="body1">{entry.type}</Typography>
        <Typography variant="caption" color="secondary">
          {entry.date}
        </Typography>
        {entry.comment && (
          <Typography variant="body2" color="secondary" style={styles.comment}>
            {entry.comment}
          </Typography>
        )}
      </View>
      <View style={styles.gradeLabel}>
        <Typography
          variant="caption"
          style={{ color: getGradeColor(entry.grade) }}
        >
          {getGradeLabel(entry.grade)}
        </Typography>
      </View>
    </View>
  </Card>
);

export const SubjectDetailScreen: React.FC = () => {

  const average = mockGrades.reduce((sum, g) => sum + g.grade, 0) / mockGrades.length;
  const gradesCount = mockGrades.length;
  const fivesCount = mockGrades.filter((g) => g.grade === 5).length;
  const foursCount = mockGrades.filter((g) => g.grade === 4).length;

  return (
    <ScreenContainer padding={false}>
      <View style={styles.header}>
        <View style={styles.headerStats}>
          <View style={styles.mainStat}>
            <Typography variant="h1" color="light">
              {average.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="light">
              Средний балл
            </Typography>
          </View>
          <View style={styles.secondaryStats}>
            <View style={styles.stat}>
              <Typography variant="h4" color="light">
                {gradesCount}
              </Typography>
              <Typography variant="caption" color="light">
                оценок
              </Typography>
            </View>
            <View style={styles.stat}>
              <Typography variant="h4" color="light">
                {fivesCount}
              </Typography>
              <Typography variant="caption" color="light">
                пятёрок
              </Typography>
            </View>
            <View style={styles.stat}>
              <Typography variant="h4" color="light">
                {foursCount}
              </Typography>
              <Typography variant="caption" color="light">
                четвёрок
              </Typography>
            </View>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressSegment,
              {
                flex: fivesCount,
                backgroundColor: colors.grades.excellent,
                borderTopLeftRadius: borderRadius.full,
                borderBottomLeftRadius: borderRadius.full,
              },
            ]}
          />
          <View
            style={[
              styles.progressSegment,
              {
                flex: foursCount,
                backgroundColor: colors.grades.good,
                borderTopRightRadius: borderRadius.full,
                borderBottomRightRadius: borderRadius.full,
              },
            ]}
          />
        </View>
      </View>

      <FlatList
        data={mockGrades}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GradeCard entry={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Typography variant="h4" style={styles.listHeader}>
            История оценок
          </Typography>
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary.main,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  mainStat: {},
  secondaryStats: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  stat: {
    alignItems: 'center',
  },
  progressBar: {
    height: 8,
    flexDirection: 'row',
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressSegment: {
    height: '100%',
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  listHeader: {
    marginBottom: spacing.sm,
  },
  gradeCard: {},
  gradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  gradeInfo: {
    flex: 1,
  },
  gradeLabel: {
    alignItems: 'flex-end',
  },
  comment: {
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
});
