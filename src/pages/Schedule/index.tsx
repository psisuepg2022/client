import React, { useCallback, useEffect, useState } from 'react';
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
  isAfter,
  isEqual,
} from 'date-fns';
import TopToolbar from '@components/TopToolbar';
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
import CreateEventModal from '@components/CreateEventModal';
import { WeeklySchedule } from '@models/WeeklySchedule';
import ScheduledEventModal from '@components/ScheduledEventModal';
import { ScheduleEvent } from '@interfaces/ScheduleEvent';
import { useAuth } from '@contexts/Auth';
import CircularProgressWithContent from '@components/CircularProgressWithContent';
import { LogoContainer } from '@pages/Schedule/styles';
import logoPSIS from '@assets/PSIS-Logo-Invertido-Transparente.png';
import { WeeklyScheduleLock } from '@models/WeeklyScheduleLock';
import { useSchedule } from '@contexts/Schedule';
import { Response } from '@interfaces/Response';
import { AllScheduleEvents } from '@interfaces/AllScheduleEvents';
import { useProfessionals } from '@contexts/Professionals';
import { Professional } from '@models/Professional';
import { ProfessionalScheduleEvents } from '@interfaces/ProfessionalScheduleEvents';

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

type Ranges = {
  start: Date;
  end: Date;
};

const Schedule = (): JSX.Element => {
  const {
    user: { permissions },
  } = useAuth();
  const { list } = useProfessionals();
  const {
    getScheduleEvents,
    setCurrentProfessional,
    currentProfessional,
    currentSchedule,
    setCurrentSchedule,
  } = useSchedule();
  const [retrievedWeeklySchedule, setRetrievedWeeklySchedule] = useState<
    WeeklySchedule[]
  >([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [currentSlotInfo, setCurrentSlotInfo] = useState<SlotInfo | undefined>(
    undefined
  );
  const [currentEvent, setCurrentEvent] = useState<Event | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await list({
          // List Professionals
          page: 0,
          size: 100,
        }).then(async (professionals) => {
          const initialDate = new Date().toISOString().split('T')[0];
          const requests: Promise<any>[] = [];

          professionals.content?.items.forEach((professional) => {
            requests.push(getScheduleEventsAsync(professional, initialDate));
          });

          const requestsResult: ProfessionalScheduleEvents[] =
            await Promise.all(requests).then((response) => response);

          setCurrentProfessional(
            professionals.content?.items[0] as Professional
          );

          const firstSchedule = requestsResult.find(
            (item) => item.professionalId === professionals.content?.items[0].id
          ) as AllScheduleEvents;

          setCurrentSchedule(firstSchedule);
          console.log('REQUYEST', requestsResult);

          const currentDate = new Date();
          const dayIndex = getDay(currentDate) + 1;
          const today = firstSchedule.weeklySchedule.find(
            (item) => item.dayOfTheWeek === dayIndex
          ) as WeeklySchedule;

          const weeklyScheduleEvents: ScheduleEvent[] = buildWeeklySchedule(
            currentDate,
            today
          ) as ScheduleEvent[];

          const weeklyScheduleLocksEvents: ScheduleEvent[] = today?.locks?.map(
            (lock: WeeklyScheduleLock) => {
              return buildWeeklyScheduleLocks(currentDate, lock);
            }
          ) as ScheduleEvent[];

          const formEvents: Event[] = firstSchedule.appointments.map(
            (event) => {
              const startTime = event.startDate.split('T')[1].substring(0, 4);
              const startDate = new Date(event.startDate);
              startDate.setHours(Number(startTime.split(':')[0]));
              startDate.setMinutes(Number(startTime.split(':')[1]));
              startDate.setSeconds(0);
              const endTime = event.endDate.split('T')[1].substring(0, 4);
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
            }
          ) as Event[];

          setRetrievedWeeklySchedule(firstSchedule.weeklySchedule || []);
          setEvents((prev) => [
            ...prev,
            ...weeklyScheduleEvents,
            ...weeklyScheduleLocksEvents,
            ...formEvents,
          ]);
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.log('ERR WEEKLY', e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // const initialDate = new Date().toISOString().split('T')[0];
        // const { content }: Response<AllScheduleEvents> =
        //   await getScheduleEvents(
        //     { startDate: initialDate, endDate: initialDate },
        //     ''
        //   );
        // const formEvents: Event[] = content?.appointments.map((event) => {
        //   const startTime = event.startDate.split('T')[1].substring(0, 4);
        //   const startDate = new Date(event.startDate);
        //   startDate.setHours(Number(startTime.split(':')[0]) - 3);
        //   startDate.setMinutes(Number(startTime.split(':')[1]));
        //   startDate.setSeconds(0);
        //   const endTime = event.endDate.split('T')[1].substring(0, 4);
        //   const endDate = new Date(event.endDate);
        //   endDate.setHours(Number(endTime.split(':')[0]) - 3);
        //   endDate.setMinutes(Number(endTime.split(':')[1]));
        //   endDate.setSeconds(0);
        //   return {
        //     start: startDate,
        //     end: endDate,
        //     title: event.title,
        //     resource: event.resource,
        //   };
        // }) as Event[];
        // console.log('FORM', formEvents);
        // setEvents((prev) => [...prev, ...formEvents]);
        // const currentDate = new Date();
        // const dayIndex = getDay(currentDate) + 1;
        // const today = content?.weeklySchedule.find(
        //   (item) => item.dayOfTheWeek === dayIndex
        // ) as WeeklySchedule;
        // const weeklyScheduleEvents: ScheduleEvent[] = buildWeeklySchedule(
        //   currentDate,
        //   today
        // ) as ScheduleEvent[];
        // const weeklyScheduleLocksEvents: ScheduleEvent[] = today?.locks?.map(
        //   (lock: WeeklyScheduleLock) => {
        //     return buildWeeklyScheduleLocks(currentDate, lock);
        //   }
        // ) as ScheduleEvent[];
        // setRetrievedWeeklySchedule(content?.weeklySchedule || []);
        // setEvents([...weeklyScheduleEvents, ...weeklyScheduleLocksEvents]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.log('ERR WEEKLY', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  console.log('EVENT', events);

  const getScheduleEventsAsync = async (
    professional: Professional,
    initialDate: string
  ): Promise<ProfessionalScheduleEvents> => {
    const { content }: Response<AllScheduleEvents> = await getScheduleEvents(
      { startDate: initialDate, endDate: initialDate },
      professional.id,
      true
    );

    return {
      professionalId: professional.id,
      ...content,
    } as ProfessionalScheduleEvents;
  };

  const buildWeeklySchedule = (date: Date, today: WeeklySchedule): Event[] => {
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

  const buildWeeklyScheduleLocks = (
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

  const onRangeChange = useCallback(
    (range: Date[] | Ranges, view?: View | undefined) => {
      if (view === 'month' || ('start' in range && 'end' in range)) return;
      // if (view === 'month' || ('start' in range && 'end' in range)) {
      //   const ranges: Ranges = range as Ranges;
      //   const eachDay = eachDayOfInterval({
      //     start: ranges.start,
      //     end: ranges.end,
      //   });

      //   const locks: Event[] = [];
      //   const hours: Event[] = [];

      //   eachDay.forEach((date: Date) => {
      //     const currentDate = new Date();
      //     currentDate.setHours(0, 0, 0, 0);
      //     const dateIndex = getDay(date);
      //     const today = retrievedWeeklySchedule?.find(
      //       (item) => item.dayOfTheWeek === dateIndex
      //     );

      //     if (isAfter(date, currentDate) || isEqual(date, currentDate)) {
      //       const weeklySchedule: Event[] = buildWeeklySchedule(
      //         date,
      //         today as WeeklySchedule
      //       );

      //       const weeklyScheduleLocks: Event[] = today?.locks?.map(
      //         (lock: WeeklyScheduleLock) => {
      //           const newLock = buildWeeklyScheduleLocks(date, lock);
      //           return newLock;
      //         }
      //       ) as Event[];

      //       console.log('WEEK', weeklyScheduleLocks, weeklySchedule);
      //       hours.push(...weeklySchedule);
      //       locks.push(...weeklyScheduleLocks);
      //     }
      //   });

      //   setEvents((prev) => {
      //     const removeOldLocks = prev.filter(
      //       (item) => item.resource !== 'LOCK'
      //     );

      //     return [...removeOldLocks, ...hours, ...locks];
      //   });
      //   return;
      // }

      const allEvents: Event[] = [];

      const dates: Date[] = range as Date[];
      dates.forEach((date: Date) => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const dateIndex = getDay(date) + 1;
        const today = retrievedWeeklySchedule?.find(
          (item) => item.dayOfTheWeek === dateIndex
        );

        if (isAfter(date, currentDate) || isEqual(date, currentDate)) {
          const weeklySchedule: Event[] = buildWeeklySchedule(
            date,
            today as WeeklySchedule
          );

          const weeklyScheduleLocks: Event[] = today?.locks?.map(
            (lock: WeeklyScheduleLock) => {
              const newLock = buildWeeklyScheduleLocks(date, lock);
              return newLock;
            }
          ) as ScheduleEvent[];

          allEvents.push(...weeklySchedule);
          allEvents.push(...weeklyScheduleLocks);
        }
      });

      setEvents((prev) => {
        const removeOldLocks = prev.filter((item) => item.resource !== 'LOCK');

        return [...removeOldLocks, ...allEvents];
      });
    },
    [retrievedWeeklySchedule]
  );

  // const onRangeChange = useCallback(
  //   (range: Date[] | Ranges, view?: View | undefined) => {
  //     if (view === 'month' || ('start' in range && 'end' in range)) {
  //       const ranges: Ranges = range as Ranges;
  //       const eachDay = eachDayOfInterval({
  //         start: ranges.start,
  //         end: ranges.end,
  //       });

  //       const locks: ScheduleEvent[] = [];
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
        onSelectEvent={(event: Event) =>
          event?.resource !== 'LOCK' && setCurrentEvent(event)
        }
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
