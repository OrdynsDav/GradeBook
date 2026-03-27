import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Typography, Skeleton } from '@shared/ui';
import { spacing, type ThemeColors } from '@shared/config/theme';
import { getGradeColor } from '@shared/lib/utils';
import type { RecentGradeRow } from '../../lib/recentGrades';

interface DashboardRecentGradesSectionProps {
  colors: ThemeColors;
  isLoading: boolean;
  items: RecentGradeRow[];
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

export const DashboardRecentGradesSection: React.FC<DashboardRecentGradesSectionProps> = ({
  colors,
  isLoading,
  items,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Typography variant="h4">Последние оценки</Typography>
      </View>
      <Card padding="sm">
        {isLoading ? (
          <View style={styles.list}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.row, i < 2 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border.light }]}>
                <View style={styles.rowMain}>
                  <Skeleton width="65%" height={16} borderRadius={4} />
                  <Skeleton width={80} height={12} borderRadius={4} style={{ marginTop: 4 }} />
                </View>
                <Skeleton width={36} height={36} borderRadius={8} />
              </View>
            ))}
          </View>
        ) : items.length === 0 ? (
          <View style={styles.centered}>
            <Ionicons name="school-outline" size={22} color={colors.text.secondary} />
            <Typography variant="body2" color="secondary">
              Нет последних оценок
            </Typography>
          </View>
        ) : (
          <View style={styles.list}>
            {items.map((row, index) => (
              <View
                key={row.id}
                style={[
                  styles.row,
                  index < items.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border.light },
                ]}
              >
                <View style={styles.rowMain}>
                  <Typography variant="body1" numberOfLines={1} style={styles.subjectName}>
                    {row.subjectName}
                  </Typography>
                  <Typography variant="caption" color="secondary">
                    {formatDate(row.gradedAt)}
                  </Typography>
                </View>
                <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(row.value, colors) }]}>
                  <Typography variant="body1" color="light" style={styles.gradeText}>
                    {row.value}
                  </Typography>
                </View>
              </View>
            ))}
          </View>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  list: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  rowMain: {
    flex: 1,
    minWidth: 0,
  },
  subjectName: {
    marginBottom: 2,
  },
  gradeBadge: {
    minWidth: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeText: {
    fontWeight: '600',
  },
});
