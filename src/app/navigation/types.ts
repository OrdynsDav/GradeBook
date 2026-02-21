import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Параметры экранов в стеке «Профиль» (вкладка Профиль).
 * Добавляй сюда новый экран, когда создаёшь раздел в профиле.
 */
export type ProfileStackParamList = {
  ProfileMain: undefined;
  Notifications: undefined;
  AboutApp: undefined;
  // Будущие разделы:
  // Settings: undefined;
  Help: undefined;
};

/**
 * Параметры экранов в стеке «Оценки».
 */
export type GradesStackParamList = {
  GradesList: undefined;
  SubjectDetail: { subjectId: string; subjectName: string };
};

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> =
  NativeStackScreenProps<ProfileStackParamList, T>;

export type GradesStackScreenProps<T extends keyof GradesStackParamList> =
  NativeStackScreenProps<GradesStackParamList, T>;
