import { addDays, format, startOfWeek } from 'date-fns';

export interface WorkingDay {
  index: number;
  date: Date;
  isoDate: string;
  shortLabel: string;
  fullLabel: string;
  dayOfMonth: string;
  isDisabled: boolean;
}

const WEEKDAY_SHORT_LABELS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'] as const;
const WEEKDAY_FULL_LABELS = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье',
] as const;

export function buildCalendarWeek(referenceDate: Date): WorkingDay[] {
  const monday = startOfWeek(referenceDate, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(monday, index);
    const isDisabled = index > 4;

    return {
      index,
      date,
      isoDate: format(date, 'yyyy-MM-dd'),
      shortLabel: WEEKDAY_SHORT_LABELS[index],
      fullLabel: WEEKDAY_FULL_LABELS[index],
      dayOfMonth: format(date, 'd'),
      isDisabled,
    };
  });
}
