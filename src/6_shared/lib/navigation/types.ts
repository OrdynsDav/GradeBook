import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Параметры экранов в стеке «Профиль» (вкладка Профиль).
 * FSD: типы навигации в shared, чтобы pages не импортировали из app.
 */
export type ProfileStackParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  Notifications: undefined;
  AboutApp: undefined;
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
