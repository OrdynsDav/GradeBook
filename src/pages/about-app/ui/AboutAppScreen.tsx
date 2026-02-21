import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Typography, ScreenContainer, Toast } from '@shared/ui';
import { spacing } from '@shared/config/theme';

/** Ник разработчика в Телеграм (копируется по нажатию) */
const TELEGRAM_NICK = '@davohakk';

export const AboutAppScreen: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

  /** Копирует ник в буфер и показывает тост «Скопировано» */
  const handleCopyNick = async () => {
    await Clipboard.setStringAsync(TELEGRAM_NICK);
    setShowToast(true);
  };

  return (
    <View style={styles.wrapper}>
      <Toast
        visible={showToast}
        text="Скопировано"
        icon="checkmark-circle"
        topOffset={0}
        onDismiss={() => setShowToast(false)}
      />
    <ScreenContainer scrollable>
      <View style={styles.content}>
        {/* Заголовок и версия */}
        <Typography variant="h3" style={styles.title}>
          О приложении
        </Typography>
        <Typography variant="body1" color="secondary" style={styles.version}>
          Версия 1.0.0
        </Typography>

        <Typography variant="body1" style={styles.paragraph}>
          Электронный журнал ПКТ — это приложение для студентов и преподавателей Псковского
          кооперативного техникума. Здесь можно смотреть оценки, расписание и важные объявления,
          не заходя на сайт. Всё под рукой в одном месте.
        </Typography>

        <Typography variant="h4" style={styles.sectionTitle}>
          Для кого этот журнал
        </Typography>
        <Typography variant="body1" style={styles.paragraph}>
          Журнал создан специально для Псковского кооперативного техникума (ПКТ). Им пользуются
          студенты разных курсов и специальностей, чтобы следить за успеваемостью и расписанием.
          Мы стараемся делать интерфейс простым и удобным, чтобы им было комфортно пользоваться
          каждый день.
        </Typography>

        <Typography variant="h4" style={styles.sectionTitle}>
          Об авторе
        </Typography>
        <Typography variant="body1" style={styles.paragraph}>
          Приложение разработал студент группы И14-1 — Давит. Идея сделать отдельный журнал для
          техникума появилась из желания упростить доступ к оценкам и расписанию. Разработка велась
          в учебных целях и как проект для своего учебного заведения.
        </Typography>
        <Typography variant="body1" style={styles.paragraph}>
          Если у вас есть предложения по улучшению приложения или вы заметили неудобство в интерфейсе —
          напишите разработчику. Обратная связь помогает делать приложение лучше для всех.
        </Typography>

        <Typography variant="h4" style={styles.sectionTitle}>
          Нашли ошибку?
        </Typography>
        <Typography variant="body1" style={styles.paragraph}>
          Если в работе приложения что-то пошло не так: не открывается экран, не загружаются оценки,
          вылетает приложение или отображаются неверные данные — пожалуйста, сообщите об этом.
          Опишите, что вы делали и что произошло — так проще найти и исправить ошибку.
        </Typography>
        {/* Блок с ником Телеграм: по нажатию копируется и показывается тост */}
        <View style={styles.paragraph}>
          <View style={styles.paragraphRow}>
            <Typography variant="body1" style={styles.paragraphText}>
              Написать можно в Телеграм:{' '}
            </Typography>
            <TouchableOpacity onPress={handleCopyNick} activeOpacity={0.7}>
              <Typography variant="body1" style={styles.link}>{TELEGRAM_NICK}</Typography>
            </TouchableOpacity>
            <Typography variant="body1" style={styles.paragraphText}>
              . По возможности отвечаю в течение одного–двух дней. Спасибо, что помогаете улучшать журнал.
            </Typography>
          </View>
        </View>

        <Typography variant="h4" style={styles.sectionTitle}>
          Благодарности
        </Typography>
        <Typography variant="body1" style={styles.paragraph}>
          Спасибо преподавателям и администрации Псковского кооперативного техникума за поддержку
          идеи электронного журнала. Спасибо одногруппникам и всем, кто тестировал приложение и
          подсказывал, что можно улучшить. Ваши отзывы очень помогают.
        </Typography>

        <Typography variant="caption" color="secondary" style={styles.footer}>
          © 2026 ПОЧУ ПКТ. Электронный журнал для студентов и преподавателей.
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
  version: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  paragraph: {
    marginBottom: spacing.md,
  },
  paragraphRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  paragraphText: {
    lineHeight: 22,
  },
  link: {
    fontWeight: '600',
    textDecorationLine: 'underline',
    lineHeight: 22,
  },
  footer: {
    marginTop: spacing.xl,
  },
});
