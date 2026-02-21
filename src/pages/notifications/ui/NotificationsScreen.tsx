import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, Typography, Card } from '../../../shared/ui';
import { colors, spacing, borderRadius } from '../../../shared/config/theme';

type NotificationType = 'grade' | 'homework' | 'announcement' | 'schedule';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'grade',
    title: 'Новая оценка',
    message: 'Вы получили 5 по математике за контрольную работу',
    date: '10 минут назад',
    isRead: false,
  },
  {
    id: '2',
    type: 'homework',
    title: 'Домашнее задание',
    message: 'Новое задание по физике: параграф 15, упражнения 1-5',
    date: '1 час назад',
    isRead: false,
  },
  {
    id: '3',
    type: 'announcement',
    title: 'Объявление',
    message: 'Родительское собрание состоится 25 февраля в 18:00',
    date: '2 часа назад',
    isRead: false,
  },
  {
    id: '4',
    type: 'schedule',
    title: 'Изменение расписания',
    message: 'Урок английского языка перенесён с 3 на 5 урок',
    date: 'Вчера',
    isRead: true,
  },
  {
    id: '5',
    type: 'grade',
    title: 'Новая оценка',
    message: 'Вы получили 4 по русскому языку за домашнюю работу',
    date: 'Вчера',
    isRead: true,
  },
  {
    id: '6',
    type: 'announcement',
    title: 'Объявление',
    message: 'Школьная олимпиада по математике - регистрация открыта',
    date: '2 дня назад',
    isRead: true,
  },
];

const getNotificationIcon = (type: NotificationType): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case 'grade':
      return 'star';
    case 'homework':
      return 'book';
    case 'announcement':
      return 'megaphone';
    case 'schedule':
      return 'calendar';
    default:
      return 'notifications';
  }
};

const getNotificationColor = (type: NotificationType): string => {
  switch (type) {
    case 'grade':
      return colors.secondary.main;
    case 'homework':
      return colors.status.info;
    case 'announcement':
      return colors.primary.main;
    case 'schedule':
      return colors.status.warning;
    default:
      return colors.text.secondary;
  }
};

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  const iconColor = getNotificationColor(notification.type);

  return (
    <Card
      style={[
        styles.notificationCard,
        !notification.isRead && styles.notificationCardUnread,
      ]}
    >
      <View style={styles.notificationContent}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${iconColor}20` },
          ]}
        >
          <Ionicons
            name={getNotificationIcon(notification.type)}
            size={20}
            color={iconColor}
          />
        </View>
        <View style={styles.textContent}>
          <View style={styles.titleRow}>
            <Typography variant="body1" style={{ fontWeight: '600' }}>
              {notification.title}
            </Typography>
            {!notification.isRead && <View style={styles.unreadDot} />}
          </View>
          <Typography variant="body2" color="secondary" numberOfLines={2}>
            {notification.message}
          </Typography>
          <Typography variant="caption" color="disabled" style={styles.date}>
            {notification.date}
          </Typography>
        </View>
      </View>
    </Card>
  );
};

export const NotificationsScreen: React.FC = () => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <ScreenContainer padding={false}>
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Typography variant="body2" color="light">
            {unreadCount} непрочитанных уведомлений
          </Typography>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationCard notification={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="notifications-off-outline"
              size={64}
              color={colors.text.disabled}
            />
            <Typography variant="h4" color="secondary" align="center">
              Нет уведомлений
            </Typography>
            <Typography variant="body2" color="disabled" align="center">
              Здесь будут появляться ваши уведомления
            </Typography>
          </View>
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  unreadBanner: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  notificationCard: {
    padding: spacing.md,
  },
  notificationCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.main,
  },
  notificationContent: {
    flexDirection: 'row',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.main,
  },
  date: {
    marginTop: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
    gap: spacing.sm,
  },
});
