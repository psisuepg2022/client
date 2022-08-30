import React, { useEffect, useState } from 'react';
import { getDay } from 'date-fns';
import { Event } from 'react-big-calendar';
import Schedule from '@components/Schedule';
import { api } from '@service/index';
import logoPSIS from '@assets/PSIS-Logo-Invertido-Transparente.png';
import { LogoContainer } from './styles';
import CircularProgressWithContent from '@components/CircularProgressWithContent';
import { WeeklySchedule } from '@models/WeeklySchedule';
import { Appointment } from '@models/Appointment';

const Agenda = (): JSX.Element => {
  const [events, setEvents] = useState<Event[]>([]);
  const [weekAgenda, setWeekAgenda] = useState<WeeklySchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const res = await api.get('horarios');
      const hours: WeeklySchedule[] = res.data;
      const currentDate = new Date();
      const today = getDay(currentDate);
      const dayHour = hours.find((item) => item.dayOfTheWeek === today);

      const newHours: Event[] = [
        {
          resource: 'lock',
          title: 'start',
          start: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            0,
            0,
            0
          ),
          end: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            Number(dayHour?.startTime.split(':')[0]),
            Number(dayHour?.startTime.split(':')[1]),
            0
          ),
        },
        {
          resource: 'lock',
          start: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            Number(dayHour?.endTime.split(':')[0]),
            Number(dayHour?.endTime.split(':')[1]),
            0
          ),
          end: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            23,
            59,
            59
          ),
        },
      ];

      const newLocks: Event[] = dayHour?.weeklyScheduleLocks?.map((item) => {
        const startDate = new Date(currentDate.getTime());
        startDate.setHours(Number(item.startTime.split(':')[0]));
        startDate.setMinutes(Number(item.startTime.split(':')[1]));
        startDate.setSeconds(0);

        const endDate = new Date(currentDate.getTime());
        endDate.setHours(Number(item.endTime.split(':')[0]));
        endDate.setMinutes(Number(item.endTime.split(':')[1]));
        endDate.setSeconds(0);

        return {
          start: startDate,
          end: endDate,
          resource: 'lock',
          title: 'Almoço',
        };
      }) as Event[];

      setWeekAgenda(hours);
      setEvents((prev) => [...prev, ...newLocks, ...newHours]);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await api.get('events');
      const resEvents: Appointment[] = res.data;

      const formEvents: Event[] = resEvents.map((event) => {
        const startTime = new Date(event.startDate).toLocaleTimeString('en', {
          timeStyle: 'short',
          hour12: false,
          timeZone: 'UTC',
        });
        const startDate = new Date(event.startDate);
        startDate.setHours(Number(startTime.split(':')[0]));
        startDate.setMinutes(Number(startTime.split(':')[1]));
        startDate.setSeconds(0);

        const endTime = new Date(event.endDate).toLocaleTimeString('en', {
          timeStyle: 'short',
          hour12: false,
          timeZone: 'UTC',
        });
        const endDate = new Date(event.endDate);
        endDate.setHours(Number(endTime.split(':')[0]));
        endDate.setMinutes(Number(endTime.split(':')[1]));
        endDate.setSeconds(0);

        return {
          start: startDate,
          end: endDate,
          title: event.title,
          resource: event.resource,
        };
      });

      setEvents((prev) => [...prev, ...formEvents]);
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100vh',
        }}
      >
        <CircularProgressWithContent
          content={<LogoContainer src={logoPSIS} />}
          size={200}
        />
      </div>
    );

  return <Schedule givenEvents={events} weekAgenda={weekAgenda} />;
};

export default Agenda;
