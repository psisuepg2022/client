import { EventStatus } from './EventStatus';

export type AppointmentComments = {
  id: string;
  status: EventStatus;
  updatedAt: string;
  comments?: string;
};
