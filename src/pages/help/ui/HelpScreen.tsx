import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { ScreenContainer, Typography, Toast } from '@shared/ui';
import { spacing } from '@shared/config/theme';

/** Ник поддержки в Телеграм */
const SUPPORT_TELEGRAM = '@davohakk';

export const HelpScreen: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

  const handleCopySupport = async () => {
    await Clipboard.setStringAsync(SUPPORT_TELEGRAM);
    setShowToast(true);
  };

  return (
    <View style={styles.wrapper}>
      <Toast
        visible={showToast}
        text="Скопировано"
        icon="checkmark-circle"
        onDismiss={() => setShowToast(false)}
      />
    <ScreenContainer scrollable>
      <View style={styles.content}>
        <Typography variant="h3" style={styles.title}>
          Помощь
        </Typography>
        <Typography variant="body1" color="secondary" style={styles.intro}>
          Если что-то не получается в приложении или возникла ошибка — напишите нам. Мы постараемся ответить и помочь.
        </Typography>

        <Typography variant="h4" style={styles.sectionTitle}>
          Куда писать
        </Typography>
        <Typography variant="body1" style={styles.paragraph}>
          Поддержка ведётся в Телеграм. Напишите в личные сообщения по нику ниже — скопируйте его и вставьте в поиск Телеграм или перейдите по ссылке, если она есть в описании.
        </Typography>
        <TouchableOpacity onPress={handleCopySupport} activeOpacity={0.7} style={styles.contactBlock}>
          <Typography variant="body1" style={styles.contactLabel}>Телеграм:</Typography>
          <Typography variant="body1" style={styles.contactNick}>{SUPPORT_TELEGRAM}</Typography>
          <Typography variant="caption" color="secondary" style={styles.contactHint}>
            Нажмите, чтобы скопировать
          </Typography>
        </TouchableOpacity>

        <Typography variant="h4" style={styles.sectionTitle}>
          Что написать в сообщении
        </Typography>
        <Typography variant="body1" style={styles.paragraph}>
          Чтобы быстрее разобраться с проблемой, опишите коротко:
        </Typography>
        <Typography variant="body1" style={styles.paragraph}>
          • Что вы делали (например: «зашёл в оценки», «открыл расписание»).{'\n'}
          • Что произошло (приложение закрылось, не загружается экран, неверные данные и т.п.).{'\n'}
          • По возможности — модель телефона и версию приложения (указана в разделе «О приложении»).
        </Typography>
        <Typography variant="body1" style={styles.paragraph}>
          Не обязательно писать длинно — достаточно сути. Если понадобятся детали, мы уточним в переписке.
        </Typography>

        <Typography variant="h4" style={styles.sectionTitle}>
          Время ответа
        </Typography>
        <Typography variant="body1" style={styles.paragraph}>
          Обычно отвечаем в течение одного–двух рабочих дней. Если вопрос срочный, так и напишите — по возможности ответим быстрее.
        </Typography>

        <Typography variant="caption" color="secondary" style={styles.footer}>
          Спасибо, что пользуетесь электронным журналом ПКТ.
        </Typography>
      </View>
    </ScreenContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  title: {
    marginBottom: spacing.xs,
  },
  intro: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  paragraph: {
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  contactBlock: {
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
  },
  contactLabel: {
    marginBottom: spacing.xs,
  },
  contactNick: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  contactHint: {
    marginTop: spacing.xs,
  },
  footer: {
    marginTop: spacing.xl,
  },
});
