import { SavedEvent } from './SavedEvent';

export type UpdatedEvent = SavedEvent & {
  updatedAt: string;
};
