import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { format, parse, startOfWeek, getDay, isAfter, isEqual } from 'date-fns';
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
import { showAlert } from '@utils/showAlert';
import {
  buildWeeklyScheduleLocks,
  weekRange,
  weekRangeDates,
  buildWeeklySchedule,
} from './utils';
import { Modal } from '@mui/material';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [scheduleLoading, setScheduleLoading] = useState<boolean>(false);
  const previousRange = useRef<string[]>();

  useEffect(() => {
    (async () => {
      try {
        await list({
          // List Professionals
          page: 0,
          size: 100,
        }).then(async (professionals) => {
          // then only used for garanteed professionals retrieve

          const [startOfWeek, endOfWeek] = weekRange(new Date());
          const startOfWeekDate = format(startOfWeek, 'yyyy-MM-dd');
          const endOfWeekDate = format(endOfWeek, 'yyyy-MM-dd');
          const weekRangeBetweenDates = weekRangeDates(startOfWeek, endOfWeek);
          const weekRangeDatesOnly = weekRangeBetweenDates.map((date) =>
            format(date, 'yyyy-MM-dd')
          );

          previousRange.current = weekRangeDatesOnly;

          console.log(previousRange.current);

          const requests: Promise<ProfessionalScheduleEvents>[] = [];

          professionals.content?.items.forEach((professional) => {
            requests.push(
              getScheduleEventsAsync(
                professional,
                startOfWeekDate,
                endOfWeekDate,
                true
              )
            );
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
        showAlert({
          text: e?.response?.data?.message || 'Ocorreu um problema inesperado',
          icon: 'error',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getScheduleEventsAsync = async (
    professional: Professional,
    startDate: string,
    endDate: string,
    weekly?: boolean
  ): Promise<ProfessionalScheduleEvents> => {
    const { content }: Response<AllScheduleEvents> = await getScheduleEvents(
      { startDate, endDate },
      professional.id,
      weekly
    );

    return {
      professionalId: professional.id,
      ...content,
    } as ProfessionalScheduleEvents;
  };

  const onRangeChange = useCallback(
    (range: Date[] | Ranges, view?: View | undefined) => {
      console.log('RANGE', range);

      const allEvents: Event[] = [];
      const dates: Date[] = range as Date[];
      const startDate = format(
        'start' in range ? range.start : dates[0],
        'yyyy-MM-dd'
      );
      const endDate = format(
        'end' in range ? range.end : dates[dates.length - 1],
        'yyyy-MM-dd'
      );

      if (view === 'month' || ('start' in range && 'end' in range)) {
        setScheduleLoading(true);
        getScheduleEventsAsync(
          currentProfessional as Professional,
          startDate,
          endDate
        )
          .then((retrievedEvents) => {
            setEvents((prev) => {
              const removeOldEvents = prev.filter(
                (item) => item.resource === 'LOCK'
              );

              const mappedNewEvents: Event[] = retrievedEvents.appointments.map(
                (item) => {
                  const startTime = item.startDate
                    .split('T')[1]
                    .substring(0, 4);
                  const startDate = new Date(item.startDate);
                  startDate.setHours(Number(startTime.split(':')[0]));
                  startDate.setMinutes(Number(startTime.split(':')[1]));
                  startDate.setSeconds(0);
                  const endTime = item.endDate.split('T')[1].substring(0, 4);
                  const endDate = new Date(item.endDate);
                  endDate.setHours(Number(endTime.split(':')[0]));
                  endDate.setMinutes(Number(endTime.split(':')[1]));
                  endDate.setSeconds(0);

                  return {
                    title: `${item.title}`,
                    start: startDate,
                    end: endDate,
                    resource: `${item.resource}`,
                  };
                }
              );

              return [...removeOldEvents, ...mappedNewEvents];
            });

            console.log('RESPONSE', retrievedEvents);
          })
          .catch((e) => console.log('ERRO REEWTRIEVE', e))
          .finally(() => setScheduleLoading(false));
        return;
      }

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

          const weeklyScheduleLocks: Event[] =
            (today?.locks?.map((lock: WeeklyScheduleLock) => {
              const newLock = buildWeeklyScheduleLocks(date, lock);
              return newLock;
            }) as ScheduleEvent[]) || [];

          allEvents.push(...weeklySchedule);
          allEvents.push(...weeklyScheduleLocks);
        }
      });

      setEvents((prev) => {
        const removeOldLocks = prev.filter((item) => item.resource !== 'LOCK');

        return [...removeOldLocks, ...allEvents];
      });

      if (!previousRange.current?.includes(startDate)) {
        console.log('RANGES', startDate, endDate);

        const [startOfWeek, endOfWeek] = weekRange(dates[0]);
        const weekRangeBetweenDates = weekRangeDates(startOfWeek, endOfWeek);
        const weekRangeDatesOnly = weekRangeBetweenDates.map((date) =>
          format(date, 'yyyy-MM-dd')
        );

        console.log('NEW RANGE', weekRangeDatesOnly);
        previousRange.current = weekRangeDatesOnly;

        setScheduleLoading(true);
        getScheduleEventsAsync(
          currentProfessional as Professional,
          weekRangeDatesOnly[0],
          weekRangeDatesOnly[weekRangeDatesOnly.length - 1]
        )
          .then((retrievedEvents) => {
            setEvents((prev) => {
              const removeOldEvents = prev.filter(
                (item) => item.resource === 'LOCK'
              );

              const mappedNewEvents: Event[] = retrievedEvents.appointments.map(
                (item) => {
                  const startTime = item.startDate
                    .split('T')[1]
                    .substring(0, 4);
                  const startDate = new Date(item.startDate);
                  startDate.setHours(Number(startTime.split(':')[0]));
                  startDate.setMinutes(Number(startTime.split(':')[1]));
                  startDate.setSeconds(0);
                  const endTime = item.endDate.split('T')[1].substring(0, 4);
                  const endDate = new Date(item.endDate);
                  endDate.setHours(Number(endTime.split(':')[0]));
                  endDate.setMinutes(Number(endTime.split(':')[1]));
                  endDate.setSeconds(0);

                  return {
                    title: `${item.title}`,
                    start: startDate,
                    end: endDate,
                    resource: `${item.resource}`,
                  };
                }
              );

              return [...removeOldEvents, ...mappedNewEvents];
            });

            console.log('RESPONSE', retrievedEvents);
          })
          .catch((e) => console.log('ERRO REEWTRIEVE', e))
          .finally(() => setScheduleLoading(false));
      }
    },
    [retrievedWeeklySchedule]
  );

  console.log('EVENTS,', events);

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
      <Modal
        open={scheduleLoading}
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center ',
        }}
      >
        <CircularProgressWithContent
          content={<LogoContainer src={logoPSIS} />}
          size={200}
        />
      </Modal>
      <CreateEventModal
        handleClose={() => setCurrentSlotInfo(undefined)}
        open={currentSlotInfo !== undefined}
        slotInfo={currentSlotInfo}
        addNewEvent={(newEvent: Event) =>
          setEvents((prev) => [...prev, newEvent])
        }
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
        step={currentProfessional?.baseDuration}
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
          permissions.includes('CREATE_APPOINTMENT') &&
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
