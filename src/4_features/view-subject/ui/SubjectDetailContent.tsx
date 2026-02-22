import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { ScreenContainer, Typography } from '@shared/ui';
import { spacing, borderRadius } from '@shared/config/theme';
import { useTheme } from '@shared/lib';
import { getGradeColor } from '@shared/lib/utils';
import { useSubjectDetail } from '../model/useSubjectDetail';
import { GradeCard } from './GradeCard';
import type { GradeEntry } from '../model/types';

interface SubjectDetailContentProps {
  subjectId: string;
}

export const SubjectDetailContent: React.FC<SubjectDetailContentProps> = ({ subjectId }) => {
  const { theme } = useTheme();
  const {
    gradeEntries,
    isLoading,
    expandedCommentId,
    handleCommentPress,
  } = useSubjectDetail(subjectId);

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

  const average =
    gradeEntries.length > 0
      ? gradeEntries.reduce((sum, g) => sum + g.grade, 0) / gradeEntries.length
      : 0;
  const fivesCount = gradeEntries.filter((g) => g.grade === 5).length;
  const foursCount = gradeEntries.filter((g) => g.grade === 4).length;
  const summaryStats = [
    { value: gradeEntries.length, label: 'оценок' },
    { value: fivesCount, label: 'пятёрок' },
    { value: foursCount, label: 'четвёрок' },
  ];
  const useHeaderBackground = theme.mode === 'light';
  const titleColor = useHeaderBackground ? 'light' : 'primary';
  const subtitleColor = useHeaderBackground ? 'light' : 'secondary';
  const accentColor = useHeaderBackground
    ? theme.colors.primary.contrast
    : theme.colors.primary.light;
  const averageValueStyle = { ...styles.averageValue, color: accentColor };
  const averageLabelStyle = useHeaderBackground
    ? { ...styles.averageLabel, ...styles.averageLabelOnHeader }
    : styles.averageLabel;
  const statLabelStyle = useHeaderBackground
    ? { ...styles.statLabel, ...styles.statLabelOnHeader }
    : styles.statLabel;

  if (isLoading && gradeEntries.length === 0) {
    return (
      <ScreenContainer>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Typography variant="body2" color="secondary">
            Загрузка оценок...
          </Typography>
        </View>
      </ScreenContainer>
    );
  }

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
            <Typography variant="h1" color={titleColor} style={averageValueStyle}>
              {average.toFixed(2)}
            </Typography>
            <Typography variant="body2" color={subtitleColor} style={averageLabelStyle}>
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
        data={gradeEntries}
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
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
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
});
