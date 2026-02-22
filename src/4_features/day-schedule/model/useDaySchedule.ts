import { useState, useCallback, useMemo, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { useCalendarStore } from '@entities/calendar';
import { ScheduleApi, getApiErrorMessage, type LessonItem } from '@shared/lib/api';
import { buildCalendarWeek, type WorkingDay } from './buildCalendarWeek';

export function useDaySchedule() {
  const today = useCalendarStore((state) => state.today);
  const refreshToday = useCalendarStore((state) => state.refreshToday);

  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const todayDate = useMemo(() => parseISO(today.isoDate), [today.isoDate]);
  const calendarWeek = useMemo(() => buildCalendarWeek(todayDate), [todayDate]);
  const todayCalendarIndex = useMemo(() => {
    const index = calendarWeek.findIndex(
      (day) => format(day.date, 'yyyy-MM-dd') === today.isoDate
    );
    return index >= 0 ? index : 0;
  }, [calendarWeek, today.isoDate]);

  const [selectedDayIndex, setSelectedDayIndex] = useState(todayCalendarIndex);

  useEffect(() => {
    setSelectedDayIndex(todayCalendarIndex);
  }, [todayCalendarIndex]);

  useEffect(() => {
    refreshToday();
  }, [refreshToday]);

  const selectedCalendarDay: WorkingDay | undefined = calendarWeek[selectedDayIndex] ?? calendarWeek[0];

  const loadScheduleForDay = useCallback(async (date: Date) => {
    try {
      setIsLoading(true);
      setError('');
      const data = await ScheduleApi.getWeekSchedule(format(date, 'yyyy-MM-dd'));
      const items = Array.isArray(data?.items) ? data.items : [];
      const dayLessons = items.filter((lesson) => {
        const lessonDate = new Date(lesson.startsAt);
        return format(lessonDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      });
      setLessons(dayLessons);
    } catch (err) {
      console.error('Schedule load failed:', err);
      setError(getApiErrorMessage(err, 'Ошибка загрузки расписания'));
      setLessons([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCalendarDay) {
      loadScheduleForDay(selectedCalendarDay.date);
    }
  }, [selectedCalendarDay?.isoDate, loadScheduleForDay]);

  const setSelectedDay = useCallback((index: number) => {
    setSelectedDayIndex(index);
  }, []);

  return {
    calendarWeek,
    selectedDayIndex,
    setSelectedDay,
    selectedCalendarDay,
    lessons,
    isLoading,
    error,
    todayDate,
    loadScheduleForDay,
  };
}
