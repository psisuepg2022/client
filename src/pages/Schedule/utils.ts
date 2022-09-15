import { WeeklySchedule } from '@models/WeeklySchedule';
import { WeeklyScheduleLock } from '@models/WeeklyScheduleLock';
import { eachDayOfInterval } from 'date-fns';
import { Event } from 'react-big-calendar';

export function weekRange(day: Date) {
  const remainingDays = 7;

  const currentDate = day;

  const firstWeekDate = new Date(day);

  firstWeekDate.setDate(currentDate.getDate() - currentDate.getDay());

  const lastWeekDate = new Date(day);
  lastWeekDate.setDate(firstWeekDate.getDate() + (remainingDays - 1));

  return [firstWeekDate, lastWeekDate];
}

export function weekRangeDates(start: Date, end: Date) {
  return eachDayOfInterval({
    start,
    end,
  });
}

export const buildWeeklySchedule = (
  date: Date,
  today: WeeklySchedule
): Event[] => {
  const newHours: Event[] = [
    {
      resource: 'LOCK',
      title: 'start',
      start: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0
      ),
      end: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        Number(today?.startTime.split(':')[0]),
        Number(today?.startTime.split(':')[1]),
        0
      ),
    },
    {
      resource: 'LOCK',
      start: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        Number(today?.endTime.split(':')[0]),
        Number(today?.endTime.split(':')[1]),
        0
      ),
      end: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59
      ),
    },
  ];

  return newHours;
};

export const buildWeeklyScheduleLocks = (
  date: Date,
  lock: WeeklyScheduleLock
): Event => {
  const startDate = new Date(date.getTime());
  startDate.setHours(Number(lock.startTime.split(':')[0]));
  startDate.setMinutes(Number(lock.startTime.split(':')[1]));
  startDate.setSeconds(0);
  const endDate = new Date(date.getTime());
  endDate.setHours(Number(lock.endTime.split(':')[0]));
  endDate.setMinutes(Number(lock.endTime.split(':')[1]));
  endDate.setSeconds(0);

  return {
    start: startDate,
    end: endDate,
    resource: 'LOCK',
  };
};
