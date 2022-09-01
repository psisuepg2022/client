import { WeeklySchedule } from '@models/WeeklySchedule';
import { WeeklyScheduleLock } from '@models/WeeklyScheduleLock';
import { ScheduleEvent } from './ScheduleEvent';

export type AllScheduleEvents = {
  appointments: ScheduleEvent[];
  weeklySchedule: WeeklySchedule[];
  scheduleLocks: WeeklyScheduleLock[];
};
