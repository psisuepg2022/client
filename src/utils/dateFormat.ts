import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

type DateFormatProps = {
  date: Date;
  stringFormat: string;
};

export const dateFormat = ({ date, stringFormat }: DateFormatProps): string => {
  return format(date, stringFormat, { locale: ptBR });
};
