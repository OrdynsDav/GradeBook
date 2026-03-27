import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Skeleton, ScreenContainer } from '@shared/ui';
import { spacing } from '@shared/config/theme';

export const DashboardSkeleton: React.FC = () => {
  return (
    <ScreenContainer scrollable>
      {/* Greeting */}
      <View style={styles.greeting}>
        <Skeleton width="60%" height={24} borderRadius={6} />
        <Skeleton width="35%" height={14} borderRadius={4} style={styles.mt8} />
      </View>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} style={styles.statCard}>
            <Skeleton width={48} height={48} borderRadius={24} />
            <Skeleton width={36} height={22} borderRadius={4} style={styles.mt8} />
            <Skeleton width={64} height={12} borderRadius={4} style={styles.mt4} />
          </Card>
        ))}
      </View>

      {/* Today schedule */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Skeleton width="55%" height={18} borderRadius={4} />
          <Skeleton width={60} height={14} borderRadius={4} />
        </View>
        <Card padding="sm">
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.scheduleRow, i < 2 && styles.scheduleRowBorder]}>
              <View style={styles.scheduleLeft}>
                <Skeleton width={52} height={14} borderRadius={4} />
                <Skeleton width="80%" height={16} borderRadius={4} style={styles.mt4} />
                <Skeleton width="40%" height={12} borderRadius={4} style={styles.mt4} />
              </View>
            </View>
          ))}
        </Card>
      </View>

      {/* Recent grades */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Skeleton width="45%" height={18} borderRadius={4} />
        </View>
        <Card padding="sm">
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.gradeRow, i < 2 && styles.scheduleRowBorder]}>
              <View style={styles.gradeLeft}>
                <Skeleton width="65%" height={16} borderRadius={4} />
                <Skeleton width={80} height={12} borderRadius={4} style={styles.mt4} />
              </View>
              <Skeleton width={36} height={36} borderRadius={8} />
            </View>
          ))}
        </Card>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  greeting: {
    marginBottom: spacing.lg,
  },
  mt4: {
    marginTop: 4,
  },
  mt8: {
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: spacing.md,
    gap: 0,
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
  scheduleRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  scheduleRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.15)',
  },
  scheduleLeft: {
    flex: 1,
  },
  gradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  gradeLeft: {
    flex: 1,
  },
});
