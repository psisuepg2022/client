import { DaysOfTheWeek } from '../interfaces/DaysOfTheWeek';
import { WeeklyScheduleLock } from './WeeklyScheduleLock';

export type WeeklySchedule = {
  id: string;
  startTime: string;
  endTime: string;
  dayOfTheWeek: DaysOfTheWeek;
  locks?: WeeklyScheduleLock[];
};

export type UpdateWeeklySchedule = {
  id: string;
  startTime: string;
  endTime: string;
  dayOfTheWeek?: number;
  locks?: {
    startTime: string;
    endTime: string;
    id?: string;
  }[];
};

export type CreateWeeklySchedule = {
  startTime: string;
  endTime: string;
  disableDay: boolean;
  dayOfTheWeek: string | number;
  locks?: {
    startTime: string;
    endTime: string;
  }[];
  altered?: boolean;
};
