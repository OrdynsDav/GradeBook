import { create } from 'zustand';
import { SubjectsApi, type GradeItem, type SubjectListItem } from '@shared/lib/api';
import type { GradesStore, GradesComputed, SubjectWithGrades } from './types';

function computeFromGrades(grades: GradeItem[]): {
  average: number;
  total: number;
  fives: number;
  fours: number;
  threes: number;
} {
  if (grades.length === 0) {
    return { average: 0, total: 0, fives: 0, fours: 0, threes: 0 };
  }
  const sum = grades.reduce((s, g) => s + g.value, 0);
  const fives = grades.filter((g) => g.value === 5).length;
  const fours = grades.filter((g) => g.value === 4).length;
  const threes = grades.filter((g) => g.value === 3).length;
  return {
    average: sum / grades.length,
    total: grades.length,
    fives,
    fours,
    threes,
  };
}

export function getComputedFromStore(gradesBySubject: Record<string, GradeItem[]>): GradesComputed {
  const allGrades = Object.values(gradesBySubject).flat();
  const { average: overallAverage, total: totalCount, fives: fivesCount, fours: foursCount, threes: threesCount } =
    computeFromGrades(allGrades);
  return {
    allGrades,
    overallAverage,
    totalCount,
    fivesCount,
    foursCount,
    threesCount,
  };
}

function formatTeacher(teacher: SubjectListItem['teacher']): string {
  if (!teacher) return '—';
  const initial = teacher.firstName?.charAt(0) ?? '';
  const middle = teacher.middleName ? ` ${teacher.middleName.charAt(0)}.` : '';
  return `${teacher.lastName} ${initial}.${middle}`.trim();
}

export function getSubjectsWithGrades(
  subjects: SubjectListItem[],
  gradesBySubject: Record<string, GradeItem[]>
): SubjectWithGrades[] {
  return subjects.map((subject) => {
    const list = gradesBySubject[subject.id] ?? [];
    const values = list.map((g) => g.value);
    const { average } = computeFromGrades(list);
    return {
      ...subject,
      grades: values,
      average,
      teacherFormatted: formatTeacher(subject.teacher),
    };
  });
}

export const useGradesStore = create<GradesStore>((set, get) => ({
  gradesBySubject: {},
  isLoading: false,
  loadingSubjectIds: new Set(),
  error: null,

  setGradesForSubject: (subjectId, grades) => {
    set((state) => ({
      gradesBySubject: { ...state.gradesBySubject, [subjectId]: grades },
      error: null,
    }));
  },

  fetchGradesForSubject: async (subjectId) => {
    const { setGradesForSubject, loadingSubjectIds } = get();
    set((state) => ({
      loadingSubjectIds: new Set(state.loadingSubjectIds).add(subjectId),
      error: null,
    }));
    try {
      const grades = await SubjectsApi.getSubjectGrades(subjectId);
      setGradesForSubject(subjectId, grades);
    } catch (err) {
      set((state) => ({
        error: err instanceof Error ? err.message : 'Ошибка загрузки оценок',
        gradesBySubject: { ...state.gradesBySubject, [subjectId]: [] },
      }));
    } finally {
      set((state) => {
        const next = new Set(state.loadingSubjectIds);
        next.delete(subjectId);
        return { loadingSubjectIds: next };
      });
    }
  },

  fetchGradesForSubjects: async (subjects) => {
    set({ isLoading: true, error: null });
    const { setGradesForSubject } = get();
    try {
      await Promise.all(
        subjects.map(async (subject) => {
          try {
            const grades = await SubjectsApi.getSubjectGrades(subject.id);
            setGradesForSubject(subject.id, grades);
          } catch {
            setGradesForSubject(subject.id, []);
          }
        })
      );
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Ошибка загрузки оценок',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
