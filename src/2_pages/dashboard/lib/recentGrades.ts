import type { GradeItem, SubjectListItem } from '@shared/lib/api';

export interface RecentGradeRow {
  id: string;
  subjectName: string;
  value: number;
  gradedAt: string;
}

/** Последние оценки по дате (новые сверху), без soft-deleted. */
export function buildRecentGradeRows(
  subjects: SubjectListItem[],
  gradesBySubject: Record<string, GradeItem[]>,
  limit = 5
): RecentGradeRow[] {
  const nameBySubjectId = Object.fromEntries(subjects.map((s) => [s.id, s.name]));
  const all = Object.values(gradesBySubject).flat().filter((g) => !g.deletedAt);
  all.sort((a, b) => new Date(b.gradedAt).getTime() - new Date(a.gradedAt).getTime());
  return all.slice(0, limit).map((g) => ({
    id: g.id,
    subjectName: nameBySubjectId[g.subjectId] ?? 'Предмет',
    value: g.value,
    gradedAt: g.gradedAt,
  }));
}
