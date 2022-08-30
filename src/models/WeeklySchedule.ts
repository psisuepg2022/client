import { DaysOfTheWeek } from '../interfaces/DaysOfTheWeek';
import { WeeklyScheduleLock } from './WeeklyScheduleLock';

export type WeeklySchedule = {
  id: string;
  startTime: string;
  endTime: string;
  dayOfTheWeek: DaysOfTheWeek;
  weeklyScheduleLocks?: WeeklyScheduleLock[];
};
