import React from 'react';
import { TodayScheduleBlock } from '@features/today-schedule';
import type { LessonItem } from '@shared/lib/api';

interface DashboardTodayScheduleSectionProps {
  lessons: LessonItem[];
  weekdayLabel: string;
}

export const DashboardTodayScheduleSection: React.FC<DashboardTodayScheduleSectionProps> = ({
  lessons,
  weekdayLabel,
}) => {
  return <TodayScheduleBlock lessons={lessons} weekdayLabel={weekdayLabel} />;
};
