import { Event } from 'react-big-calendar';

export type ScheduleEvent = Omit<Event, 'start' | 'end'> & {
  updatedAt?: Date | string;
  startDate: string;
  endDate: string;
};
