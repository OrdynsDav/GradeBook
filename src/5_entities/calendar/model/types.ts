export interface TodayCalendarState {
  isoDate: string;
  dayOfMonth: number;
  weekdayShort: string;
  weekdayFull: string;
  /** 0..4 для Пн..Пт, null если выходной */
  workingDayIndex: number | null;
}

export interface CalendarStoreState {
  today: TodayCalendarState;
}

export interface CalendarStoreActions {
  setToday: (today: TodayCalendarState) => void;
  refreshToday: () => void;
}
