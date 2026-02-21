import React, { useCallback, memo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, Typography, Card } from '@shared/ui';
import { colors, spacing, borderRadius, type Theme } from '@shared/config/theme';
import { useTheme } from '@shared/lib';
import { GradesStackParamList } from '@app/navigation/types';

type NavigationProp = NativeStackNavigationProp<GradesStackParamList, 'GradesList'>;

interface Subject {
  id: string;
  name: string;
  average: number;
  grades: number[];
  teacher: string;
}

const subjects: Subject[] = [
  { id: '1', name: 'Математика', average: 4.5, grades: [5, 4, 5, 4, 5], teacher: 'Петрова А.И.' },
  { id: '2', name: 'Русский язык', average: 4.2, grades: [4, 4, 5, 4, 4], teacher: 'Сидорова М.П.' },
  { id: '3', name: 'Физика', average: 4.8, grades: [5, 5, 5, 4, 5], teacher: 'Козлов В.А.' },
  { id: '4', name: 'История', average: 4.0, grades: [4, 4, 4, 4, 4], teacher: 'Иванов С.С.' },
  { id: '5', name: 'Английский язык', average: 4.6, grades: [5, 4, 5, 5, 4], teacher: 'Смирнова Е.В.' },
  { id: '6', name: 'Химия', average: 3.8, grades: [4, 3, 4, 4, 4], teacher: 'Новикова О.Н.' },
  { id: '7', name: 'Биология', average: 4.4, grades: [4, 5, 4, 5, 4], teacher: 'Морозова Л.К.' },
  { id: '8', name: 'География', average: 4.6, grades: [5, 5, 4, 5, 4], teacher: 'Волкова Н.А.' },
];

const getGradeColor = (grade: number): string => {
  if (grade >= 4.5) return colors.grades.excellent;
  if (grade >= 3.5) return colors.grades.good;
  if (grade >= 2.5) return colors.grades.satisfactory;
  return colors.grades.poor;
};

interface SubjectCardProps {
  subject: Subject;
  onPress: (subject: Subject) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = memo(({ subject, onPress }) => (
  <Card style={styles.subjectCard} onPress={() => onPress(subject)}>
    <View style={styles.subjectHeader}>
      <View style={styles.subjectInfo}>
        <Typography variant="h4" numberOfLines={1}>
          {subject.name}
        </Typography>
        <Typography variant="caption" color="secondary">
          {subject.teacher}
        </Typography>
      </View>
      <Ionicons style={styles.cardArrow} name="chevron-forward" size={20} color={colors.text.secondary} />
    </View>
    <View style={styles.gradesPreview}>
      <Typography variant="caption" color="secondary" style={styles.gradesLabel}>
        Последние оценки:
      </Typography>
      <View style={styles.gradesList}>
        {subject.grades.slice(-5).map((grade, index) => (
          <View
            key={index}
            style={[
              styles.gradeBadge,
              { backgroundColor: getGradeColor(grade) },
            ]}
          >
            <Typography variant="body2" color="light">
              {grade}
            </Typography>
          </View>
        ))}
      </View>
      <View
        style={[
          styles.averageContainer,
          { backgroundColor: getGradeColor(subject.average) },
        ]}
      >
        <Typography variant="h4" color="light">
          {subject.average.toFixed(1)}
        </Typography>
      </View>
    </View>
  </Card>
));

SubjectCard.displayName = 'SubjectCard';

type SummaryDesign = 'ribbon' | 'insight';

// Current active design for the top summary card.
// "ribbon" keeps previous version, "insight" is the new experiment.
const ACTIVE_SUMMARY_DESIGN: SummaryDesign = 'insight';

interface SummaryCardProps {
  overallAverage: number;
  subjectCount: number;
  totalGrades: number;
  performanceLabel: string;
  theme: Theme;
}

const withAlpha = (hexColor: string, alphaHex: string): string => `${hexColor}${alphaHex}`;

const SummaryCardRibbon: React.FC<SummaryCardProps> = ({
  overallAverage,
  subjectCount,
  totalGrades,
  performanceLabel,
  theme,
}) => (
  <View
    style={[
      styles.summaryCard,
      {
        backgroundColor: theme.colors.primary.main,
        borderBottomColor: theme.colors.primary.dark,
      },
    ]}
  >
    <View style={styles.summaryTop}>
      <View style={styles.summaryContent}>
        <Typography variant="body1" color="light">
          Общий средний балл
        </Typography>
        <View style={styles.summaryAverageRow}>
          <Typography variant="h1" color="light">
            {overallAverage.toFixed(2)}
          </Typography>
          <View
            style={[
              styles.summaryTrendChip,
              { backgroundColor: withAlpha(theme.colors.primary.contrast, '1F') },
            ]}
          >
            <Ionicons
              name="trending-up"
              size={14}
              color={theme.colors.primary.contrast}
            />
            <Typography variant="caption" color="light">
              {performanceLabel}
            </Typography>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.summaryAverageBadge,
          { backgroundColor: withAlpha(theme.colors.primary.contrast, '26') },
        ]}
      >
        <Ionicons name="ribbon-outline" size={22} color={theme.colors.primary.contrast} />
      </View>
    </View>

    <View
      style={[
        styles.summaryDivider,
        { backgroundColor: withAlpha(theme.colors.primary.contrast, '24') },
      ]}
    />

    <View style={styles.summaryStats}>
      <View
        style={[
          styles.summaryStatCard,
          { backgroundColor: withAlpha(theme.colors.primary.contrast, '14') },
        ]}
      >
        <Typography variant="h4" color="light">
          {subjectCount}
        </Typography>
        <Typography variant="caption" color="light">
          предметов
        </Typography>
      </View>
      <View
        style={[
          styles.summaryStatCard,
          { backgroundColor: withAlpha(theme.colors.primary.contrast, '14') },
        ]}
      >
        <Typography variant="h4" color="light">
          {totalGrades}
        </Typography>
        <Typography variant="caption" color="light">
          оценок
        </Typography>
      </View>
    </View>
  </View>
);

const SummaryCardInsight: React.FC<SummaryCardProps> = ({
  overallAverage,
  subjectCount,
  totalGrades,
  performanceLabel,
  theme,
}) => {
  const gradeColor = getGradeColor(overallAverage);
  const useHeaderBackground = theme.mode === 'light';
  const primaryAccent =
    theme.mode === 'dark' ? theme.colors.primary.light : theme.colors.primary.main;
  const targetGap = 4.5 - overallAverage;
  const targetText =
    targetGap > 0 ? `до 4.50: +${targetGap.toFixed(2)}` : 'цель 4.50 достигнута';
  const titleColor = useHeaderBackground ? 'light' : 'primary';
  const subtitleColor = useHeaderBackground ? 'light' : 'secondary';
  const valueColor = useHeaderBackground ? theme.colors.primary.contrast : primaryAccent;
  const accentIconColor = useHeaderBackground ? theme.colors.primary.contrast : primaryAccent;
  const chipColor = useHeaderBackground ? theme.colors.primary.contrast : gradeColor;

  return (
    <View
      style={[
        styles.summaryAltCard,
        {
          backgroundColor: useHeaderBackground
            ? theme.colors.primary.main
            : theme.colors.background.paper,
          borderBottomColor: useHeaderBackground
            ? theme.colors.primary.dark
            : theme.colors.border.light,
        },
      ]}
    >
      <View style={styles.summaryAltHeader}>
        <View
          style={[
            styles.summaryAltIconWrap,
            {
              backgroundColor: useHeaderBackground
                ? withAlpha(theme.colors.primary.contrast, '26')
                : withAlpha(primaryAccent, theme.mode === 'dark' ? '2B' : '1A'),
            },
          ]}
        >
          <Ionicons name="analytics-outline" size={20} color={accentIconColor} />
        </View>
        <View style={styles.summaryAltHeaderText}>
          <Typography variant="body1" color={titleColor}>
            Общий средний балл
          </Typography>
          <Typography
            variant="caption"
            color={subtitleColor}
            style={useHeaderBackground ? { opacity: 0.85 } : undefined}
          >
            {performanceLabel}
          </Typography>
        </View>
      </View>

      <View style={styles.summaryAltValueRow}>
        <Typography variant="h1" style={{ color: valueColor }}>
          {overallAverage.toFixed(2)}
        </Typography>
        <View
          style={[
            styles.summaryAltTargetChip,
            { backgroundColor: withAlpha(gradeColor, '1C') },
            useHeaderBackground && {
              backgroundColor: withAlpha(theme.colors.primary.contrast, '1F'),
            },
          ]}
        >
          <Ionicons name="sparkles-outline" size={14} color={chipColor} />
          <Typography variant="caption" style={{ color: chipColor, fontWeight: '600' }}>
            {targetText}
          </Typography>
        </View>
      </View>

      <View style={styles.summaryAltStats}>
        <View
          style={[
            styles.summaryAltStatItem,
            {
              backgroundColor: useHeaderBackground
                ? withAlpha(theme.colors.primary.contrast, '12')
                : theme.colors.background.default,
              borderColor: useHeaderBackground
                ? withAlpha(theme.colors.primary.contrast, '2B')
                : theme.colors.border.light,
            },
          ]}
        >
          <Ionicons
            name="book-outline"
            size={16}
            color={useHeaderBackground ? theme.colors.primary.contrast : theme.colors.text.secondary}
          />
          <Typography variant="h4" color={titleColor}>
            {subjectCount}
          </Typography>
          <Typography variant="caption" color={subtitleColor}>
            предметов
          </Typography>
        </View>
        <View
          style={[
            styles.summaryAltStatItem,
            {
              backgroundColor: useHeaderBackground
                ? withAlpha(theme.colors.primary.contrast, '12')
                : theme.colors.background.default,
              borderColor: useHeaderBackground
                ? withAlpha(theme.colors.primary.contrast, '2B')
                : theme.colors.border.light,
            },
          ]}
        >
          <Ionicons
            name="list-outline"
            size={16}
            color={useHeaderBackground ? theme.colors.primary.contrast : theme.colors.text.secondary}
          />
          <Typography variant="h4" color={titleColor}>
            {totalGrades}
          </Typography>
          <Typography variant="caption" color={subtitleColor}>
            оценок
          </Typography>
        </View>
      </View>
    </View>
  );
};

export const GradesScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const handleSubjectPress = useCallback(
    (subject: Subject) => {
      navigation.navigate('SubjectDetail', {
        subjectId: subject.id,
        subjectName: subject.name,
      });
    },
    [navigation]
  );

  const renderSubjectItem = useCallback(
    ({ item }: { item: Subject }) => (
      <SubjectCard subject={item} onPress={handleSubjectPress} />
    ),
    [handleSubjectPress]
  );

  const overallAverage =
    subjects.reduce((sum, s) => sum + s.average, 0) / subjects.length;
  const totalGrades = subjects.reduce((sum, s) => sum + s.grades.length, 0);
  const performanceLabel = overallAverage >= 4.5 ? 'Отличная динамика' : 'Хорошая динамика';
  const SummaryCardComponent =
    ACTIVE_SUMMARY_DESIGN === 'insight' ? SummaryCardInsight : SummaryCardRibbon;

  return (
    <ScreenContainer padding={false}>
      <SummaryCardComponent
        overallAverage={overallAverage}
        subjectCount={subjects.length}
        totalGrades={totalGrades}
        performanceLabel={performanceLabel}
        theme={theme}
      />

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={renderSubjectItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    padding: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderBottomWidth: 1,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  summaryContent: {
    flex: 1,
  },
  summaryAverageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  summaryTrendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    marginBottom: 6,
  },
  summaryAverageBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryDivider: {
    height: 1,
  },
  summaryStats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  summaryStatCard: {
    flex: 1,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
  },
  summaryAltCard: {
    padding: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderBottomWidth: 1,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  summaryAltHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryAltIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryAltHeaderText: {
    flex: 1,
    gap: 2,
  },
  summaryAltValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  summaryAltTargetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    marginBottom: spacing.xs,
  },
  summaryAltStats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  summaryAltStatItem: {
    flex: 1,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: spacing.sm,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  subjectCard: {},
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  subjectInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  gradesPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradesLabel: {
    marginRight: spacing.sm,
  },
  gradesList: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  gradeBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardArrow: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    marginTop: -20,
  },
  averageContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginLeft: spacing.sm,
  },
});
