import { Event } from 'react-big-calendar';

export type ScheduleEvent = {
  updatedAt?: Date | string;
} & Event;
