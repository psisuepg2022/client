import { colors } from '@global/colors';

export const eventColor = (status: string): string => {
  if (status === 'AGENDADO') return colors.SCHEDULED;
  if (status === 'CONFIRMADO') return colors.CONFIRMED;
  if (status === 'CONCLUÍDO') return colors.CONCLUDED;

  return colors.SCHEDULED;
};
