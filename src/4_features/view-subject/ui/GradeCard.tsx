import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, Typography } from '@shared/ui';
import { spacing } from '@shared/config/theme';
import { getGradeColor, getGradeLabel } from '@shared/lib/utils';
import type { ThemeColors } from '@shared/config/theme';
import type { GradeEntry } from '../model/types';

interface GradeCardProps {
  entry: GradeEntry;
  themeColors: ThemeColors;
  isCommentExpanded?: boolean;
  onCommentPress?: (id: string) => void;
}

export const GradeCard: React.FC<GradeCardProps> = memo(({
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

const styles = StyleSheet.create({
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
