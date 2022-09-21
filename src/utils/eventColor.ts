import { colors } from '@global/colors';
import { EventStatus } from '@interfaces/EventStatus';

export const eventColor = (status: keyof typeof EventStatus): string => {
  if (status === 'Agendado') return colors.SCHEDULED;
  if (status === 'Cancelado') return colors.DANGER;
  if (status === 'Confirmado') return colors.CONFIRMED;
  if (status === 'Concluído') return colors.CONCLUDED;
  if (status === 'Ausência') return colors.DANGER_HOVER;

  return colors.SCHEDULED;
};
