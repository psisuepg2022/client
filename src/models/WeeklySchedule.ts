import { DaysOfTheWeek } from '../interfaces/DaysOfTheWeek';
import { WeeklyScheduleLock } from './WeeklyScheduleLock';

export type WeeklySchedule = {
  id: string;
  startTime: Date | string;
  endTime: Date | string;
  dayOfTheWeek: DaysOfTheWeek;
  weeklyScheduleLocks?: WeeklyScheduleLock[];
};
