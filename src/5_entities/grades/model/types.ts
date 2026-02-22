import type { GradeItem, SubjectListItem } from '@shared/lib/api';

export interface GradesState {
  /** Кеш: subjectId -> список оценок с сервера. При обновлении списка — заменяем. */
  gradesBySubject: Record<string, GradeItem[]>;
  isLoading: boolean;
  loadingSubjectIds: Set<string>;
  error: string | null;
}

export interface GradesComputed {
  /** Все оценки из кеша (для общего среднего и счётчиков) */
  allGrades: GradeItem[];
  overallAverage: number;
  totalCount: number;
  fivesCount: number;
  foursCount: number;
  threesCount: number;
}

export interface SubjectWithGrades extends SubjectListItem {
  grades: number[];
  average: number;
  teacherFormatted: string;
}

export interface GradesActions {
  setGradesForSubject: (subjectId: string, grades: GradeItem[]) => void;
  fetchGradesForSubject: (subjectId: string) => Promise<void>;
  /** Загружает оценки по всем переданным предметам, обновляет кеш */
  fetchGradesForSubjects: (subjects: SubjectListItem[]) => Promise<void>;
  clearError: () => void;
}

export type GradesStore = GradesState & GradesActions;
