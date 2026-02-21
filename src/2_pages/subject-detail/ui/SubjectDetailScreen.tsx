import React, { useState, useCallback, memo } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer, Typography, Card } from '@shared/ui';
import { spacing, borderRadius, type ThemeColors } from '@shared/config/theme';
import { useTheme } from '@shared/lib';

interface GradeEntry {
  id: string;
  grade: number;
  date: string;
  type: string;
  comment?: string;
}

const mockGrades: GradeEntry[] = [
  { id: '1', grade: 5, date: '20.02.2026', type: 'Контрольная работа', comment: 'Отлично! Вот так и держи, ну прям вообще красавчик Отлично! Вот так и держи, ну прям вообще красавчикОтлично! Вот так и держи, ну прям вообще красавчикОтлично! Вот так и держи, ну прям вообще красавчикОтлично! Вот так и держи, ну прям вообще красавчикОтлично! Вот так и держи, ну прям вообще красавчик' },
  { id: '2', grade: 4, date: '18.02.2026', type: 'Домашняя работа' },
  { id: '3', grade: 5, date: '15.02.2026', type: 'Ответ на уроке' },
  { id: '4', grade: 4, date: '13.02.2026', type: 'Самостоятельная работа' },
  { id: '5', grade: 5, date: '10.02.2026', type: 'Домашняя работа' },
  { id: '6', grade: 5, date: '08.02.2026', type: 'Контрольная работа', comment: 'Молодец!' },
  { id: '7', grade: 4, date: '05.02.2026', type: 'Ответ на уроке' },
  { id: '8', grade: 5, date: '03.02.2026', type: 'Домашняя работа' },
];

const getGradeColor = (grade: number, palette: ThemeColors): string => {
  if (grade === 5) return palette.grades.excellent;
  if (grade === 4) return palette.grades.good;
  if (grade === 3) return palette.grades.satisfactory;
  return palette.grades.poor;
};

const getGradeLabel = (grade: number): string => {
  if (grade === 5) return 'Отлично';
  if (grade === 4) return 'Хорошо';
  if (grade === 3) return 'Удовлетворительно';
  return 'Неудовлетворительно';
};

interface GradeCardProps {
  entry: GradeEntry;
  themeColors: ThemeColors;
  isCommentExpanded?: boolean;
  onCommentPress?: (id: string) => void;
}

const GradeCard: React.FC<GradeCardProps> = memo(({
  entry,
  themeColors,
  isCommentExpanded = false,
  onCommentPress,
}) => {
  const hasComment = Boolean(entry.comment);
  const isLongComment = hasComment && entry.comment!.length > 50;
  const needsCollapse = isLongComment && !isCommentExpanded;

  return (
    <Card style={styles.gradeCard}>
      <View style={styles.gradeContent}>
        <View
          style={[
            styles.gradeBadge,
            { backgroundColor: getGradeColor(entry.grade, themeColors) },
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
        </View>
        <View style={styles.gradeLabel}>
          <Typography
            variant="caption"
            style={{ color: getGradeColor(entry.grade, themeColors) }}
          >
            {getGradeLabel(entry.grade)}
          </Typography>
        </View>
      </View>
      {entry.comment && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={
            isLongComment && (needsCollapse || isCommentExpanded) && onCommentPress
              ? () => onCommentPress(entry.id)
              : undefined
          }
          disabled={!isLongComment || !onCommentPress}
          style={[styles.commentWrap, { borderTopColor: themeColors.border.light }]}
        >
          {needsCollapse ? (
            <View style={styles.commentCollapsed}>
              <Typography
                variant="body2"
                color="secondary"
                style={styles.commentText}
                numberOfLines={1}
              >
                {entry.comment}
              </Typography>
              <LinearGradient
                colors={['transparent', themeColors.background.paper] as const}
                start={{ x: 0, y: 0 } as const}
                end={{ x: 1, y: 0 } as const}
                style={styles.commentFade}
                pointerEvents="none"
              />
            </View>
          ) : (
            <Typography
              variant="body2"
              color="secondary"
              style={StyleSheet.flatten([styles.commentText, styles.commentExpanded])}
            >
              {entry.comment}
            </Typography>
          )}
        </TouchableOpacity>
      )}
    </Card>
  );
});

GradeCard.displayName = 'GradeCard';

export const SubjectDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const [expandedCommentId, setExpandedCommentId] = useState<string | null>(null);

  const handleCommentPress = useCallback((id: string) => {
    setExpandedCommentId((prev) => (prev === id ? null : id));
  }, []);

  const renderGradeItem = useCallback(
    ({ item }: { item: GradeEntry }) => (
      <GradeCard
        entry={item}
        themeColors={theme.colors}
        isCommentExpanded={expandedCommentId === item.id}
        onCommentPress={handleCommentPress}
      />
    ),
    [expandedCommentId, handleCommentPress, theme.colors]
  );

  const average = mockGrades.reduce((sum, g) => sum + g.grade, 0) / mockGrades.length;
  const gradesCount = mockGrades.length;
  const fivesCount = mockGrades.filter((g) => g.grade === 5).length;
  const foursCount = mockGrades.filter((g) => g.grade === 4).length;
  const summaryStats = [
    { value: gradesCount, label: 'оценок' },
    { value: fivesCount, label: 'пятёрок' },
    { value: foursCount, label: 'четвёрок' },
  ];
  const useHeaderBackground = theme.mode === 'light';
  const titleColor = useHeaderBackground ? 'light' : 'primary';
  const subtitleColor = useHeaderBackground ? 'light' : 'secondary';
  const accentColor = useHeaderBackground ? theme.colors.primary.contrast : theme.colors.primary.light;
  const averageValueStyle = { ...styles.averageValue, color: accentColor };
  const averageLabelStyle = useHeaderBackground
    ? { ...styles.averageLabel, ...styles.averageLabelOnHeader }
    : styles.averageLabel;
  const statLabelStyle = useHeaderBackground
    ? { ...styles.statLabel, ...styles.statLabelOnHeader }
    : styles.statLabel;

  return (
    <ScreenContainer padding={false}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: useHeaderBackground
              ? theme.colors.primary.main
              : theme.colors.background.paper,
            borderBottomColor: useHeaderBackground
              ? theme.colors.primary.dark
              : theme.colors.border.light,
          },
          !useHeaderBackground && styles.headerDark,
        ]}
      >
        <View style={styles.headerStats}>
          <View style={styles.mainStat}>
            <Typography
              variant="h1"
              color={titleColor}
              style={averageValueStyle}
            >
              {average.toFixed(2)}
            </Typography>
            <Typography
              variant="body2"
              color={subtitleColor}
              style={averageLabelStyle}
            >
              Средний балл
            </Typography>
          </View>
          <View style={styles.secondaryStats}>
            {summaryStats.map((item) => (
              <View
                style={[
                  styles.stat,
                  !useHeaderBackground && {
                    backgroundColor: theme.colors.background.default,
                    borderColor: theme.colors.border.light,
                  },
                ]}
                key={item.label}
              >
                <Typography variant="h4" color={titleColor} style={styles.statValue}>
                  {item.value}
                </Typography>
                <Typography
                  variant="caption"
                  color={subtitleColor}
                  style={statLabelStyle}
                  numberOfLines={1}
                >
                  {item.label}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.progressBar,
            {
              backgroundColor: useHeaderBackground
                ? theme.colors.background.paper
                : theme.colors.background.default,
            },
          ]}
        >
          <View
            style={[
              styles.progressSegment,
              {
                flex: fivesCount,
                backgroundColor: getGradeColor(5, theme.colors),
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
                backgroundColor: getGradeColor(4, theme.colors),
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
        renderItem={renderGradeItem}
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
    padding: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
  },
  headerDark: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  mainStat: {
    minWidth: 98,
    marginRight: spacing.sm,
    flexShrink: 1,
  },
  averageValue: {
    lineHeight: 48,
    marginBottom: spacing.xs,
  },
  averageLabel: {
    opacity: 1,
  },
  averageLabelOnHeader: {
    opacity: 0.9,
  },
  secondaryStats: {
    flexDirection: 'row',
    gap: spacing.sm,
    flex: 1,
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    minWidth: 0,
    flex: 1,
    borderWidth: 0,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: 6,
  },
  statValue: {
    marginBottom: spacing.xs,
  },
  statLabel: {
    opacity: 1,
    textAlign: 'center',
  },
  statLabelOnHeader: {
    opacity: 0.95,
  },
  progressBar: {
    height: 10,
    flexDirection: 'row',
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
  commentWrap: {
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
  },
  commentText: {
    fontStyle: 'italic',
  },
  commentCollapsed: {
    position: 'relative',
    minHeight: 20,
  },
  commentFade: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 48,
  },
  commentExpanded: {
    marginTop: 0,
  },
});
