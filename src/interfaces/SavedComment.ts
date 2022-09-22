import { EventStatus } from './EventStatus';

export type SavedComment = {
  appointmentId: string;
  text: string;
  updatedAt: string;
  status: EventStatus;
};
