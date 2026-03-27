import type { GradeItem, SubjectListItem } from '@shared/lib/api';

export interface GradesState {
  subjects: SubjectListItem[];
  gradesBySubject: Record<string, GradeItem[]>;
  isLoading: boolean;
  loadingSubjectIds: Set<string>;
  error: string | null;
  /** Timestamp последней успешной загрузки loadAll */
  lastLoadedAt: number;
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
  fetchGradesForSubjects: (subjects: SubjectListItem[]) => Promise<void>;
  /** Загружает предметы + оценки, пропускает, если TTL не истёк */
  loadAll: () => Promise<void>;
  /** Принудительная перезагрузка (pull-to-refresh) */
  forceRefreshAll: () => Promise<void>;
  clearError: () => void;
}

export type GradesStore = GradesState & GradesActions;
