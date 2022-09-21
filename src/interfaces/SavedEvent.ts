import { EventStatus } from './EventStatus';

export type SavedEvent = {
  id: string;
  date: string;
  status: EventStatus;
  endTime: string;
  startTime: string;
  updatedAt: string;
};
