import { colors } from '@global/colors';
import { EventStatus } from '@interfaces/EventStatus';

export const eventColor = (status: keyof typeof EventStatus): string => {
  switch (status) {
    case 'Agendado':
      return colors.SCHEDULED;
    case 'Cancelado':
      return colors.CANCELLED;
    case 'Confirmado':
      return colors.CONFIRMED;
    case 'Concluído':
      return colors.CONCLUDED;
    case 'Ausência':
      return colors.ABSENCE;
    default:
      return colors.SCHEDULED;
  }
};
