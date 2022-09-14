import React, { useCallback, useState } from 'react';
import {
  Calendar,
  Event,
  dateFnsLocalizer,
  View,
  Messages,
  ToolbarProps,
  SlotInfo,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './index.css';
import ptBR from 'date-fns/locale/pt-BR';
import {
  format,
  parse,
  startOfWeek,
  getDay,
  eachDayOfInterval,
} from 'date-fns';
import TopToolbar from '../TopToolbar';
import {
  CustomDateHeader,
  CustomEventMonth,
  CustomEventWrapper,
  CustomHeaderMonth,
  CustomHeaderWeek,
  dayPropGetter,
  eventStyleGetter,
  slotPropGetter,
} from './customComponents';
import CreateEventModal from '../CreateEventModal';
import { WeeklySchedule } from '@models/WeeklySchedule';
import ScheduledEventModal from '@components/ScheduledEventModal';
import { ScheduleEvent } from '@interfaces/ScheduleEvent';
import { useAuth } from '@contexts/Auth';
import CircularProgressWithContent from '@components/CircularProgressWithContent';
import { LogoContainer } from '@pages/Schedule/styles';
import logoPSIS from '@assets/PSIS-Logo-Invertido-Transparente.png';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const messages: Messages = {
  date: 'Data',
  time: 'Horário',
  event: 'Evento',
  allDay: 'Dia todo',
  week: 'Semana',
  work_week: 'Semana de trabalho',
  day: 'Dia',
  month: 'Mês',
  previous: 'Anterior',
  next: 'Próximo',
  yesterday: 'Ontem',
  tomorrow: 'Amanhã',
  today: 'Hoje',
  agenda: 'Agenda',

  noEventsInRange: 'Não há mais eventos.',

  showMore: (count: number) => `Mostrar mais ${count}`,
};

type ScheduleProps = {
  givenEvents: Event[];
  weekAgenda: WeeklySchedule[];
  rangeChange: any;
};

type Ranges = {
  start: Date;
  end: Date;
};

const Schedule = ({ givenEvents, weekAgenda }: ScheduleProps): JSX.Element => {
  const {
    user: { permissions },
  } = useAuth();
  const [events, setEvents] = useState<Event[]>(givenEvents);
  const [currentSlotInfo, setCurrentSlotInfo] = useState<SlotInfo | undefined>(
    undefined
  );
  const [currentEvent, setCurrentEvent] = useState<ScheduleEvent | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  const onRangeChange = useCallback(
    (range: Date[] | Ranges, view?: View | undefined) => {
      if (view === 'month' || ('start' in range && 'end' in range)) {
        const ranges: Ranges = range as Ranges;
        const eachDay = eachDayOfInterval({
          start: ranges.start,
          end: ranges.end,
        });

        const locks: Event[] = [];
        const hours: Event[] = [];

        eachDay.forEach((date: Date) => {
          const today = getDay(date);
          const dayHour = weekAgenda.find(
            (item) => item.dayOfTheWeek === today
          );

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
                Number(dayHour?.startTime.split(':')[0]),
                Number(dayHour?.startTime.split(':')[1]),
                0
              ),
            },
            {
              resource: 'LOCK',
              start: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                Number(dayHour?.endTime.split(':')[0]),
                Number(dayHour?.endTime.split(':')[1]),
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

          const newLocks: Event[] = dayHour?.locks?.map((item) => {
            const startDate = new Date(date.getTime());
            startDate.setHours(Number(item.startTime.split(':')[0]));
            startDate.setMinutes(Number(item.startTime.split(':')[1]));
            startDate.setSeconds(0);

            const endDate = new Date(date.getTime());
            endDate.setHours(Number(item.endTime.split(':')[0]));
            endDate.setMinutes(Number(item.endTime.split(':')[1]));
            endDate.setSeconds(0);

            return {
              start: startDate,
              end: endDate,
              resource: item.resource,
              // title: 'Almoço',
            };
          }) as Event[];

          hours.push(...newHours);
          locks.push(...newLocks);
        });

        setEvents((prev) => {
          const removeOldLocks = prev.filter(
            (item) => item.resource !== 'LOCK'
          );

          return [...removeOldLocks, ...hours, ...locks];
        });
        return;
      }

      const allEvents: Event[] = [];

      const dates: Date[] = range as Date[];
      dates.forEach((date: Date) => {
        const today = getDay(date);
        const dayHour = weekAgenda.find((item) => item.dayOfTheWeek === today);

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
              Number(dayHour?.startTime.split(':')[0]),
              Number(dayHour?.startTime.split(':')[1]),
              0
            ),
          },
          {
            resource: 'LOCK',
            start: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              Number(dayHour?.endTime.split(':')[0]),
              Number(dayHour?.endTime.split(':')[1]),
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

        const newLocks: Event[] = dayHour?.locks?.map((item) => {
          const startDate = new Date(date.getTime());
          startDate.setHours(Number(item.startTime.split(':')[0]));
          startDate.setMinutes(Number(item.startTime.split(':')[1]));
          startDate.setSeconds(0);
          const endDate = new Date(date.getTime());
          endDate.setHours(Number(item.endTime.split(':')[0]));
          endDate.setMinutes(Number(item.endTime.split(':')[1]));
          endDate.setSeconds(0);

          return {
            start: startDate,
            end: endDate,
            resource: 'LOCK',
            title: 'Almoço',
          };
        }) as Event[];

        allEvents.push(...newHours);
        allEvents.push(...newLocks);
      });
      setEvents((prev) => {
        const removeOldLocks = prev.filter((item) => item.resource !== 'LOCK');

        return [...removeOldLocks, ...allEvents];
      });
    },
    []
  );

  // const onRangeChange = useCallback(
  //   (range: Date[] | Ranges, view?: View | undefined) => {
  //     if (view === 'month' || ('start' in range && 'end' in range)) {
  //       const ranges: Ranges = range as Ranges;
  //       const eachDay = eachDayOfInterval({
  //         start: ranges.start,
  //         end: ranges.end,
  //       });

  //       const locks: Event[] = [];
  //       const hours: Event[] = [];

  //       eachDay.forEach((date: Date) => {
  //         const today = getDay(date);
  //         const dayHour = weekAgenda.find(
  //           (item) => item.dayOfTheWeek === today
  //         );

  //         const newHours: Event[] = [
  //           {
  //             resource: 'LOCK',
  //             title: 'start',
  //             start: new Date(
  //               date.getFullYear(),
  //               date.getMonth(),
  //               date.getDate(),
  //               0,
  //               0,
  //               0
  //             ),
  //             end: new Date(
  //               date.getFullYear(),
  //               date.getMonth(),
  //               date.getDate(),
  //               Number(dayHour?.startTime.split(':')[0]),
  //               Number(dayHour?.startTime.split(':')[1]),
  //               0
  //             ),
  //           },
  //           {
  //             resource: 'LOCK',
  //             start: new Date(
  //               date.getFullYear(),
  //               date.getMonth(),
  //               date.getDate(),
  //               Number(dayHour?.endTime.split(':')[0]),
  //               Number(dayHour?.endTime.split(':')[1]),
  //               0
  //             ),
  //             end: new Date(
  //               date.getFullYear(),
  //               date.getMonth(),
  //               date.getDate(),
  //               23,
  //               59,
  //               59
  //             ),
  //           },
  //         ];

  //         const newLocks: Event[] = dayHour?.locks?.map((item) => {
  //           const startDate = new Date(date.getTime());
  //           startDate.setHours(Number(item.startTime.split(':')[0]));
  //           startDate.setMinutes(Number(item.startTime.split(':')[1]));
  //           startDate.setSeconds(0);

  //           const endDate = new Date(date.getTime());
  //           endDate.setHours(Number(item.endTime.split(':')[0]));
  //           endDate.setMinutes(Number(item.endTime.split(':')[1]));
  //           endDate.setSeconds(0);

  //           return {
  //             start: startDate,
  //             end: endDate,
  //             resource: item.resource,
  //             // title: 'Almoço',
  //           };
  //         }) as Event[];

  //         hours.push(...newHours);
  //         locks.push(...newLocks);
  //       });

  //       setEvents((prev) => {
  //         const removeOldLocks = prev.filter(
  //           (item) => item.resource !== 'LOCK'
  //         );

  //         return [...removeOldLocks, ...hours, ...locks];
  //       });
  //       return;
  //     }

  //     const allEvents: Event[] = [];

  //     const dates: Date[] = range as Date[];
  //     dates.forEach((date: Date) => {
  //       const today = getDay(date);
  //       const dayHour = weekAgenda.find((item) => item.dayOfTheWeek === today);

  //       const newHours: Event[] = [
  //         {
  //           resource: 'LOCK',
  //           title: 'start',
  //           start: new Date(
  //             date.getFullYear(),
  //             date.getMonth(),
  //             date.getDate(),
  //             0,
  //             0,
  //             0
  //           ),
  //           end: new Date(
  //             date.getFullYear(),
  //             date.getMonth(),
  //             date.getDate(),
  //             Number(dayHour?.startTime.split(':')[0]),
  //             Number(dayHour?.startTime.split(':')[1]),
  //             0
  //           ),
  //         },
  //         {
  //           resource: 'LOCK',
  //           start: new Date(
  //             date.getFullYear(),
  //             date.getMonth(),
  //             date.getDate(),
  //             Number(dayHour?.endTime.split(':')[0]),
  //             Number(dayHour?.endTime.split(':')[1]),
  //             0
  //           ),
  //           end: new Date(
  //             date.getFullYear(),
  //             date.getMonth(),
  //             date.getDate(),
  //             23,
  //             59,
  //             59
  //           ),
  //         },
  //       ];

  //       const newLocks: Event[] = dayHour?.locks?.map((item) => {
  //         const startDate = new Date(date.getTime());
  //         startDate.setHours(Number(item.startTime.split(':')[0]));
  //         startDate.setMinutes(Number(item.startTime.split(':')[1]));
  //         startDate.setSeconds(0);
  //         const endDate = new Date(date.getTime());
  //         endDate.setHours(Number(item.endTime.split(':')[0]));
  //         endDate.setMinutes(Number(item.endTime.split(':')[1]));
  //         endDate.setSeconds(0);

  //         return {
  //           start: startDate,
  //           end: endDate,
  //           resource: 'LOCK',
  //           title: 'Almoço',
  //         };
  //       }) as Event[];

  //       allEvents.push(...newHours);
  //       allEvents.push(...newLocks);
  //     });
  //     setEvents((prev) => {
  //       const removeOldLocks = prev.filter((item) => item.resource !== 'LOCK');

  //       return [...removeOldLocks, ...allEvents];
  //     });
  //   },
  //   []
  // );

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

  return (
    <>
      <CreateEventModal
        handleClose={() => setCurrentSlotInfo(undefined)}
        open={currentSlotInfo !== undefined}
        slotInfo={currentSlotInfo}
      />
      {currentEvent && currentEvent.resource === 'Agendado' ? (
        <ScheduledEventModal
          open={currentEvent !== undefined}
          handleClose={() => setCurrentEvent(undefined)}
          eventInfo={currentEvent}
        />
      ) : null}
      <Calendar
        localizer={localizer}
        events={events}
        style={{ height: '100vh', width: '100%', fontFamily: 'Poppins' }}
        views={['day', 'week', 'month']}
        culture="pt-BR"
        step={60}
        defaultView="day"
        // formats={{
        //   eventTimeRangeFormat: () => '', // HIDES TIME IN EVENTS
        // }}
        timeslots={1}
        onRangeChange={(
          range:
            | Date[]
            | {
                start: Date;
                end: Date;
              },
          view?: View | undefined
        ) => onRangeChange(range, view)}
        dayLayoutAlgorithm="no-overlap"
        slotPropGetter={slotPropGetter}
        eventPropGetter={eventStyleGetter}
        messages={messages}
        // onSelectEvent={(event: Event) =>
        //   event?.resource !== 'LOCK' && setCurrentEvent(event)
        // }
        onSelectSlot={(slotInfo: SlotInfo) =>
          permissions.includes('CREATE_APPOINTMENTS') &&
          setCurrentSlotInfo(slotInfo)
        }
        selectable
        onSelecting={() => false}
        popup={true}
        dayPropGetter={dayPropGetter}
        components={{
          toolbar: (toolbar: ToolbarProps) =>
            TopToolbar({
              ...toolbar,
              onRangeChange,
            }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dateCellWrapper: (props: any) => {
            const { event, children } = props;
            return (
              <div
                style={{ backgroundColor: '#000' }}
                onContextMenu={(e) => {
                  alert(`${event.title} is clicked.`);
                  e.preventDefault();
                }}
              >
                {children}
              </div>
            );
          },
          month: {
            dateHeader: (props) => CustomDateHeader({ ...props, events }),
            header: CustomHeaderMonth,
            event: CustomEventMonth,
          },
          week: {
            header: CustomHeaderWeek,
          },
          eventWrapper: CustomEventWrapper,
        }}
      />
    </>
  );
};

export default Schedule;
