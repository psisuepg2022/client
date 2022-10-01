import { DaysOfTheWeek } from '@interfaces/DaysOfTheWeek';
import { CreateWeeklySchedule } from '@models/WeeklySchedule';

export type ConfigFormProps = {
  newPassword: string;
  confirmNewPassword: string;
  baseDuration: string;
};

export type FormLock = {
  id?: string;
  startTime: string;
  endTime: string;
  index?: number;
  resource?: string;
};

export const disabledDayDate = (): Date => {
  const date = new Date();

  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);

  return date;
};

export const createInitialWeeklySchedule = (): CreateWeeklySchedule[] => {
  const emptyArray = new Array(7).fill({});
  const initialWeeklySchedule: CreateWeeklySchedule[] = emptyArray.map(
    (_, index) => ({
      startTime: '00:00',
      endTime: '00:00',
      dayOfTheWeek: DaysOfTheWeek[index + 1],
      altered: false,
      disableDay: false,
      locks: [],
    })
  );

  return initialWeeklySchedule;
};
