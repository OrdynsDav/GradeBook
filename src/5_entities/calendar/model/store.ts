import { format, getDay, startOfDay } from 'date-fns';
import { create } from 'zustand';
import type { CalendarStoreActions, CalendarStoreState, TodayCalendarState } from './types';

const WEEKDAY_SHORT_LABELS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'] as const;
const WEEKDAY_FULL_LABELS = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
] as const;

const getWorkingDayIndex = (date: Date): number | null => {
  const day = getDay(date); // 0..6, где 1..5 = Пн..Пт
  if (day >= 1 && day <= 5) {
    return day - 1;
  }
  return null;
};

const createTodayState = (date: Date = new Date()): TodayCalendarState => {
  const normalizedDate = startOfDay(date);
  const day = getDay(normalizedDate);

  return {
    isoDate: format(normalizedDate, 'yyyy-MM-dd'),
    dayOfMonth: Number(format(normalizedDate, 'd')),
    weekdayShort: WEEKDAY_SHORT_LABELS[day],
    weekdayFull: WEEKDAY_FULL_LABELS[day],
    workingDayIndex: getWorkingDayIndex(normalizedDate),
  };
};

type CalendarStore = CalendarStoreState & CalendarStoreActions;

export const useCalendarStore = create<CalendarStore>((set) => ({
  today: createTodayState(),
  setToday: (today) => set({ today }),
  refreshToday: () => set({ today: createTodayState() }),
}));
