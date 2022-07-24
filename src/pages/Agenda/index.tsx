import { Box, CircularProgress, Typography } from '@mui/material';
import { getDay } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Event } from 'react-big-calendar';
import Schedule from '../../components/Schedule';
import { api } from '../../service';
import { AgendaHours } from '../../types';
import logoPSIS from '../../assets/PSIS-Logo-Invertido-Transparente.png';
import { LogoContainer } from './styles';
import CircularProgressWithContent from '../../components/CircularProgressWithContent';

const Agenda = (): JSX.Element => {
  const [events, setEvents] = useState<Event[]>([]);
  const [weekAgenda, setWeekAgenda] = useState<AgendaHours[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const res = await api.get('horarios');
      const hours: AgendaHours[] = res.data;
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
            Number(dayHour?.start.split(':')[0]),
            Number(dayHour?.start.split(':')[1]),
            0
          ),
        },
        {
          resource: 'lock',
          start: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            Number(dayHour?.end.split(':')[0]),
            Number(dayHour?.end.split(':')[1]),
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

      const newLocks: Event[] = dayHour?.restrictions.map((item) => {
        const startDate = new Date(currentDate.getTime());
        startDate.setHours(Number(item.start.split(':')[0]));
        startDate.setMinutes(Number(item.start.split(':')[1]));
        startDate.setSeconds(0);

        const endDate = new Date(currentDate.getTime());
        endDate.setHours(Number(item.end.split(':')[0]));
        endDate.setMinutes(Number(item.end.split(':')[1]));
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
      const resEvents: {
        id: number;
        title: string;
        start: string;
        end: string;
      }[] = res.data;

      const formEvents: Event[] = resEvents.map((event) => ({
        start: new Date(event.start),
        end: new Date(event.end),
        title: event.title,
      }));

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
