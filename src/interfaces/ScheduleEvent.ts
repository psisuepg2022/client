import { Event } from 'react-big-calendar';

export type ScheduleEvent = Omit<Event, 'start' | 'end'> & {
  id: string;
  updatedAt?: Date | string;
  contactNumber: string;
  startDate: string;
  endDate: string;
};
