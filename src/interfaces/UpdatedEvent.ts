import { SavedEvent } from './SavedEvent';

export type UpdatedEvent = Omit<SavedEvent, 'status'> & {
  updatedAt: string;
  resource: string;
};
