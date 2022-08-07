import { DaysOfTheWeek } from '../interfaces/DaysOfTheWeek';

export type WeeklySchedule = {
  id: string;
  startTime: Date | string;
  endTime: Date | string;
  dayOfTheWeek: DaysOfTheWeek;
};
