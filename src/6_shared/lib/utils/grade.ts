import type { ThemeColors } from '@shared/config/theme';
import { GRADE_LABELS } from '@shared/config/constants';

export function getGradeColor(grade: number, palette: ThemeColors): string {
  if (grade >= 4.5) return palette.grades.excellent;
  if (grade >= 3.5) return palette.grades.good;
  if (grade >= 2.5) return palette.grades.satisfactory;
  return palette.grades.poor;
}

export function getGradeLabel(grade: number): string {
  const rounded = Math.round(grade);
  return GRADE_LABELS[rounded] ?? '—';
}
