import { colors } from '@global/colors';
import { EventStatus } from '@interfaces/EventStatus';

export const eventColor = (status: EventStatus): string => {
  if (status === 'Agendado') return colors.SCHEDULED;
  if (status === 'Confirmado') return colors.CONFIRMED;
  if (status === 'Concluído') return colors.CONCLUDED;

  return colors.SCHEDULED;
};
