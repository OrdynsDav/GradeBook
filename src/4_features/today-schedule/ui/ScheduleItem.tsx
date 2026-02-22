import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@shared/ui';
import { useTheme } from '@shared/lib';

interface ScheduleItemProps {
  time: string;
  subject: string;
  room: string;
  isLast?: boolean;
}

export const ScheduleItem: React.FC<ScheduleItemProps> = ({
  time,
  subject,
  room,
  isLast,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.scheduleItem,
        { borderBottomColor: theme.colors.border.light },
        isLast && styles.scheduleItemLast,
      ]}
    >
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
};

const styles = StyleSheet.create({
  scheduleItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  scheduleItemLast: {
    borderBottomWidth: 0,
  },
  scheduleTime: {
    marginRight: 12,
    minWidth: 80,
  },
  scheduleContent: {
    flex: 1,
  },
});
