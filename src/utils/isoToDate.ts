import { addMinutes } from 'date-fns';

export const isoToDate = (
  iso: string,
  end?: boolean,
  baseDuration?: number
): Date => {
  const hour = iso.split('T')[1].substring(0, 2);
  const minute = iso.split('T')[1].substring(3, 5);

  const date = new Date(iso);
  date.setHours(Number(hour));
  date.setMinutes(Number(minute));
  date.setSeconds(0);

  if (end && baseDuration) return addMinutes(date, baseDuration);
  return date;
};
