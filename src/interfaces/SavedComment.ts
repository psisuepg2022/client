import { EventStatus } from './EventStatus';

export type SavedComment = {
  appointmentId: string;
  text: string;
  updatedAt: string;
  status: EventStatus;
  hasSameTimeToNextWeek: {
    patientId: string;
    date: string;
    startTime: string;
    endTime: string;
  } | null;
};
