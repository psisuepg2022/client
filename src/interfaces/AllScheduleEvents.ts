import { ScheduleLock } from '@models/ScheduleLock';
import { WeeklySchedule } from '@models/WeeklySchedule';
import { ScheduleEvent } from './ScheduleEvent';

export type AllScheduleEvents = {
  appointments: ScheduleEvent[];
  weeklySchedule: WeeklySchedule[];
  scheduleLocks: ScheduleLock[];
};
