import { format, parseISO } from 'date-fns';

export interface GradeEntry {
  id: string;
  grade: number;
  date: string;
  type: string;
  comment?: string;
}

export function gradeItemsToEntries(
  items: { id: string; value: number; gradedAt: string; comment?: string | null }[]
): GradeEntry[] {
  return items.map((g) => ({
    id: g.id,
    grade: g.value,
    date: format(parseISO(g.gradedAt), 'dd.MM.yyyy'),
    type: 'Оценка',
    comment: g.comment ?? undefined,
  }));
}
