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
import {
  format,
  parse,
  startOfWeek,
  getDay,
  isAfter,
  isEqual,
  eachDayOfInterval,
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
import { useProfessionals } from '@contexts/Professionals';
import { Professional } from '@models/Professional';
import { showAlert } from '@utils/showAlert';
import {
  buildWeeklyScheduleLocks,
  weekRange,
  weekRangeDates,
  buildWeeklySchedule,
  lockFromResource,
  statusFromResource,
  idFromResource,
} from '@utils/schedule';
import { Modal } from '@mui/material';
import ConfirmedEventModal from '@components/ConfirmedEventModal';
import { dateFormat } from '@utils/dateFormat';
import ConcludedEventModal from '@components/ConcludedEventModal';
import LockEventModal from '@components/LockEventModal';
import CancelledAbsenceEventModal from '@components/CancelledAbsenceEventModal';
import AlterTopToolbar from '@components/AlterTopToolbar';

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
  const { user } = useAuth();
  const { topBar } = useProfessionals();
  const {
    getScheduleEvents,
    setCurrentProfessional,
    currentProfessional,
    scheduleLoading,
    setScheduleLoading,
    events,
    setEvents,
    retrievedWeeklySchedule,
    setRetrievedWeeklySchedule,
  } = useSchedule();
  const [currentSlotInfo, setCurrentSlotInfo] = useState<SlotInfo | undefined>(
    undefined
  );
  const [currentEvent, setCurrentEvent] = useState<Event | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [currentStart, setCurrentStart] = useState<Date>(new Date());
  const [currentEnd, setCurrentEnd] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<string>('day');
  const previousRange = useRef<string[]>();

  useEffect(() => {
    (async () => {
      try {
        const professionals = user.permissions.includes(
          'USER_TYPE_PROFESSIONAL'
        )
          ? { content: { items: [user] } }
          : await topBar();
        const [startOfWeek, endOfWeek] = weekRange(new Date());
        const startOfWeekDate = dateFormat({
          date: startOfWeek,
          stringFormat: 'yyyy-MM-dd',
        });
        const endOfWeekDate = dateFormat({
          date: endOfWeek,
          stringFormat: 'yyyy-MM-dd',
        });
        const weekRangeBetweenDates = weekRangeDates(startOfWeek, endOfWeek);
        const weekRangeDatesOnly = weekRangeBetweenDates.map((date) =>
          dateFormat({ date, stringFormat: 'yyyy-MM-dd' })
        );

        previousRange.current = weekRangeDatesOnly;

        const firstSchedule =
          professionals.content && professionals.content.items.length !== 0
            ? await getScheduleEvents(
                { startDate: startOfWeekDate, endDate: endOfWeekDate },
                user.permissions.includes('USER_TYPE_PROFESSIONAL')
                  ? undefined
                  : professionals.content?.items[0].id,
                true
              )
            : {
                content: {
                  weeklySchedule: [],
                  appointments: [],
                  scheduleLocks: [],
                },
              };

        const initialProfessional =
          professionals.content && professionals.content.items.length > 0
            ? professionals.content.items[0]
            : {
                baseDuration: 60,
              };

        setCurrentProfessional(initialProfessional as Professional);

        firstSchedule.content &&
          firstSchedule.content.weeklySchedule.length === 0 &&
          showAlert({
            title: 'Sem profissionais',
            text: 'Não existem profissionais cadastrados ou configurados. Cadastre um novo profissional no menu ao lado e peça ao profissional que acesse a conta e cadastre seus horários.',
          });

        if (
          firstSchedule.content &&
          firstSchedule.content?.weeklySchedule.length > 0
        ) {
          const currentDate = new Date();
          const dayIndex = getDay(currentDate) + 1;
          const today = firstSchedule?.content?.weeklySchedule.find(
            (item) => item.dayOfTheWeek === dayIndex
          ) as WeeklySchedule;

          const initialStart = new Date();
          initialStart.setHours(Number(today.startTime.split(':')[0]));
          initialStart.setMinutes(Number(today.startTime.split(':')[1]));

          const initialEnd = new Date();
          initialEnd.setHours(Number(today.endTime.split(':')[0]));
          initialEnd.setMinutes(Number(today.endTime.split(':')[1]));

          setCurrentStart(initialStart);
          setCurrentEnd(initialEnd);

          // const weeklyScheduleEvents: ScheduleEvent[] = buildWeeklySchedule(
          //   currentDate,
          //   today
          // ) as ScheduleEvent[];

          const weeklyScheduleLocksEvents: ScheduleEvent[] =
            !today.startTime && !today.endTime
              ? []
              : (today?.locks?.map((lock: WeeklyScheduleLock) => {
                  return buildWeeklyScheduleLocks(currentDate, lock);
                }) as ScheduleEvent[]);

          const mappedScheduleLocks: Event[] =
            firstSchedule?.content?.scheduleLocks.map((lock) => {
              const startDate = new Date(
                Number(lock.date.split('/')[2]),
                Number(lock.date.split('/')[1]) - 1,
                Number(lock.date.split('/')[0])
              );
              startDate.setHours(Number(lock.startTime.split(':')[0]));
              startDate.setMinutes(Number(lock.startTime.split(':')[1]));
              startDate.setSeconds(0);
              const endDate = new Date(
                Number(lock.date.split('/')[2]),
                Number(lock.date.split('/')[1]) - 1,
                Number(lock.date.split('/')[0])
              );
              endDate.setHours(Number(lock.endTime.split(':')[0]));
              endDate.setMinutes(Number(lock.endTime.split(':')[1]));
              endDate.setSeconds(0);

              if (
                isAfter(endDate, currentDate) ||
                isEqual(endDate, currentDate)
              ) {
                return {
                  start: startDate,
                  end: endDate,
                  resource: `${lock.resource}/${lock.id}`,
                };
              }
            }) as Event[];

          const validScheduleLocks = mappedScheduleLocks.filter((lock) => lock);

          const mappedEvents: Event[] =
            firstSchedule?.content?.appointments.map((event) => {
              const startTime = event.startDate.split('T')[1].substring(0, 5);
              const startDate = new Date(event.startDate);
              startDate.setHours(Number(startTime.split(':')[0]));
              startDate.setMinutes(Number(startTime.split(':')[1]));
              startDate.setSeconds(0);
              const endTime = event.endDate.split('T')[1].substring(0, 5);
              const endDate = new Date(event.endDate);
              endDate.setHours(Number(endTime.split(':')[0]));
              endDate.setMinutes(Number(endTime.split(':')[1]));
              endDate.setSeconds(0);

              return {
                start: startDate,
                end: endDate,
                title: event.title,
                resource: event?.updatedAt
                  ? `${event.resource}/${event.id}/${event.updatedAt}`
                  : `${event.resource}/${event.id}`,
              };
            }) as Event[];

          setRetrievedWeeklySchedule(
            firstSchedule?.content?.weeklySchedule || []
          );
          setEvents([
            //...weeklyScheduleEvents,
            ...weeklyScheduleLocksEvents,
            ...validScheduleLocks,
            ...mappedEvents,
          ]);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.log('ERROR', e);
        showAlert({
          text: e?.response?.data?.message || 'Ocorreu um problema inesperado',
          icon: 'error',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onRangeChange = useCallback(
    (range: Date[] | Ranges, view?: View | undefined) => {
      console.log('RANGE', range, view);

      setCurrentView((prev) => (view === undefined ? prev : (view as string)));

      const allEvents: Event[] = [];
      const dates: Date[] = range as Date[];
      const startDate = dateFormat({
        date: 'start' in range ? range.start : dates[0],
        stringFormat: 'yyyy-MM-dd',
      });
      const endDate = dateFormat({
        date: 'end' in range ? range.end : dates[dates.length - 1],
        stringFormat: 'yyyy-MM-dd',
      });

      if (view === 'month' || ('start' in range && 'end' in range)) {
        setScheduleLoading(true);

        const monthDates = eachDayOfInterval({
          start: 'start' in range ? range.start : new Date(),
          end: 'end' in range ? range.end : new Date(),
        });

        monthDates.forEach((date: Date) => {
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          const dateIndex = getDay(date) + 1;
          const today = retrievedWeeklySchedule?.find(
            (item) => item.dayOfTheWeek === dateIndex
          );

          if (isAfter(date, currentDate) || isEqual(date, currentDate)) {
            if (view === 'week' || currentView === 'week') {
              const weeklySchedule: Event[] = buildWeeklySchedule(
                date,
                today as WeeklySchedule
              );
              allEvents.push(...weeklySchedule);
            }

            const weeklyScheduleLocks: Event[] =
              (today?.locks?.map((lock: WeeklyScheduleLock) => {
                const newLock = buildWeeklyScheduleLocks(date, lock);
                return newLock;
              }) as ScheduleEvent[]) || [];

            allEvents.push(...weeklyScheduleLocks);
          }
        });

        setEvents((prev) => {
          const removeOldLocks = prev.filter(
            (item) =>
              lockFromResource(item.resource) !== 'LOCK' ||
              (lockFromResource(item.resource) === 'LOCK' &&
                idFromResource(item.resource) !== undefined)
          );

          return [...removeOldLocks, ...allEvents];
        });

        getScheduleEvents(
          {
            startDate,
            endDate,
          },
          user.permissions.includes('USER_TYPE_PROFESSIONAL')
            ? undefined
            : currentProfessional?.id
        )
          .then(({ content }) => {
            setEvents((prev) => {
              const removeOldEvents = prev.filter(
                (item) =>
                  lockFromResource(item.resource) === 'LOCK' &&
                  idFromResource(item.resource) === undefined
              );

              const currentDate = new Date();

              const mappedScheduleLocks: Event[] = content?.scheduleLocks.map(
                (lock) => {
                  const startDate = new Date(
                    Number(lock.date.split('/')[2]),
                    Number(lock.date.split('/')[1]) - 1,
                    Number(lock.date.split('/')[0])
                  );
                  startDate.setHours(Number(lock.startTime.split(':')[0]));
                  startDate.setMinutes(Number(lock.startTime.split(':')[1]));
                  startDate.setSeconds(0);
                  const endDate = new Date(
                    Number(lock.date.split('/')[2]),
                    Number(lock.date.split('/')[1]) - 1,
                    Number(lock.date.split('/')[0])
                  );
                  endDate.setHours(Number(lock.endTime.split(':')[0]));
                  endDate.setMinutes(Number(lock.endTime.split(':')[1]));
                  endDate.setSeconds(0);

                  if (
                    isAfter(startDate, currentDate) ||
                    isEqual(startDate, currentDate)
                  ) {
                    return {
                      start: startDate,
                      end: endDate,
                      resource: `${lock.resource}/${lock.id}`,
                    };
                  }
                }
              ) as Event[];

              const validScheduleLocks = mappedScheduleLocks.filter(
                (lock) => lock
              );

              const mappedNewEvents: Event[] = content?.appointments.map(
                (event) => {
                  const startTime = event.startDate
                    .split('T')[1]
                    .substring(0, 5);
                  const startDate = new Date(event.startDate);
                  startDate.setHours(Number(startTime.split(':')[0]));
                  startDate.setMinutes(Number(startTime.split(':')[1]));
                  startDate.setSeconds(0);
                  const endTime = event.endDate.split('T')[1].substring(0, 5);
                  const endDate = new Date(event.endDate);
                  endDate.setHours(Number(endTime.split(':')[0]));
                  endDate.setMinutes(Number(endTime.split(':')[1]));
                  endDate.setSeconds(0);

                  return {
                    title: `${event.title}`,
                    start: startDate,
                    end: endDate,
                    resource: event?.updatedAt
                      ? `${event.resource}/${event.id}/${event.updatedAt}`
                      : `${event.resource}/${event.id}`,
                  };
                }
              ) as Event[];

              return [
                ...removeOldEvents,
                ...mappedNewEvents,
                ...validScheduleLocks,
              ];
            });
          })
          .catch((e) => {
            showAlert({
              icon: 'error',
              text:
                e?.response?.data?.message ||
                'Ocorreu um erro ao recuperar as consultas',
            });
          })
          .finally(() => setScheduleLoading(false));
        return;
      }

      console.log('CURRR', currentView);

      dates.forEach((date: Date) => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const dateIndex = getDay(date) + 1;
        const today = retrievedWeeklySchedule?.find(
          (item) => item.dayOfTheWeek === dateIndex
        );

        if (isAfter(date, currentDate) || isEqual(date, currentDate)) {
          if (view === 'week' || currentView === 'week') {
            console.log('ENTREI NA WEEK');
            const weeklySchedule: Event[] = buildWeeklySchedule(
              date,
              today as WeeklySchedule
            );
            allEvents.push(...weeklySchedule);
          }

          const weeklyScheduleLocks: Event[] =
            (today?.locks?.map((lock: WeeklyScheduleLock) => {
              const newLock = buildWeeklyScheduleLocks(date, lock);
              return newLock;
            }) as ScheduleEvent[]) || [];

          allEvents.push(...weeklyScheduleLocks);
        }
      });

      setEvents((prev) => {
        const removeOldLocks = prev.filter(
          (item) =>
            lockFromResource(item.resource) !== 'LOCK' ||
            (lockFromResource(item.resource) === 'LOCK' &&
              idFromResource(item.resource) !== undefined)
        );

        return [...removeOldLocks, ...allEvents];
      });

      const dayIndex = getDay('start' in range ? new Date() : range[0]) + 1;
      const today = retrievedWeeklySchedule.find(
        (item) => item.dayOfTheWeek === dayIndex
      ) as WeeklySchedule;

      const newCurrentStart = range[0] as Date;
      if (today.startTime) {
        newCurrentStart.setHours(Number(today.startTime.split(':')[0]));
        newCurrentStart.setMinutes(Number(today.startTime.split(':')[1]));
      }

      const newCurrentEnd = range[0] as Date;

      if (today.endTime) {
        newCurrentEnd.setHours(Number(today.endTime.split(':')[0]));
        newCurrentEnd.setMinutes(Number(today.endTime.split(':')[1]));
      }
      setCurrentStart(newCurrentStart);
      setCurrentEnd(newCurrentEnd);
      console.log('tdoday', today, newCurrentStart, newCurrentEnd);

      if (!previousRange.current?.includes(startDate)) {
        console.log('RANGES', startDate, endDate);

        const [startOfWeek, endOfWeek] = weekRange(dates[0]);
        const weekRangeBetweenDates = weekRangeDates(startOfWeek, endOfWeek);
        const weekRangeDatesOnly = weekRangeBetweenDates.map((date) =>
          dateFormat({ date: date, stringFormat: 'yyyy-MM-dd' })
        );

        previousRange.current = weekRangeDatesOnly;

        setScheduleLoading(true);
        getScheduleEvents(
          {
            startDate: weekRangeDatesOnly[0],
            endDate: weekRangeDatesOnly[weekRangeDatesOnly.length - 1],
          },
          user.permissions.includes('USER_TYPE_PROFESSIONAL')
            ? undefined
            : currentProfessional?.id
        )
          .then(({ content }) => {
            setEvents((prev) => {
              const removeOldEvents = prev.filter(
                (item) =>
                  lockFromResource(item.resource) === 'LOCK' &&
                  idFromResource(item.resource) === undefined
              );

              const currentDate = new Date();

              const mappedScheduleLocks: Event[] = content?.scheduleLocks.map(
                (lock) => {
                  const startDate = new Date(
                    Number(lock.date.split('/')[2]),
                    Number(lock.date.split('/')[1]) - 1,
                    Number(lock.date.split('/')[0])
                  );
                  startDate.setHours(Number(lock.startTime.split(':')[0]));
                  startDate.setMinutes(Number(lock.startTime.split(':')[1]));
                  startDate.setSeconds(0);
                  const endDate = new Date(
                    Number(lock.date.split('/')[2]),
                    Number(lock.date.split('/')[1]) - 1,
                    Number(lock.date.split('/')[0])
                  );
                  endDate.setHours(Number(lock.endTime.split(':')[0]));
                  endDate.setMinutes(Number(lock.endTime.split(':')[1]));
                  endDate.setSeconds(0);

                  if (
                    isAfter(startDate, currentDate) ||
                    isEqual(startDate, currentDate)
                  ) {
                    return {
                      start: startDate,
                      end: endDate,
                      resource: `${lock.resource}/${lock.id}`,
                    };
                  }
                }
              ) as Event[];

              const validScheduleLocks = mappedScheduleLocks.filter(
                (lock) => lock
              );

              const mappedNewEvents: Event[] = content?.appointments.map(
                (event) => {
                  const startTime = event.startDate
                    .split('T')[1]
                    .substring(0, 5);
                  const startDate = new Date(event.startDate);
                  startDate.setHours(Number(startTime.split(':')[0]));
                  startDate.setMinutes(Number(startTime.split(':')[1]));
                  startDate.setSeconds(0);
                  const endTime = event.endDate.split('T')[1].substring(0, 5);
                  const endDate = new Date(event.endDate);
                  endDate.setHours(Number(endTime.split(':')[0]));
                  endDate.setMinutes(Number(endTime.split(':')[1]));
                  endDate.setSeconds(0);

                  return {
                    title: `${event.title}`,
                    start: startDate,
                    end: endDate,
                    resource: event?.updatedAt
                      ? `${event.resource}/${event.id}/${event.updatedAt}`
                      : `${event.resource}/${event.id}`,
                  };
                }
              ) as Event[];

              return [
                ...removeOldEvents,
                ...mappedNewEvents,
                ...validScheduleLocks,
              ];
            });
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
        <>
          <CircularProgressWithContent
            content={<LogoContainer src={logoPSIS} />}
            size={200}
          />
        </>
      </Modal>
      <CreateEventModal
        key={`${Math.random()}`}
        handleClose={(reason: 'backdropClick' | 'escapeKeyDown' | '') =>
          reason !== 'backdropClick' &&
          reason !== 'escapeKeyDown' &&
          setCurrentSlotInfo(undefined)
        }
        open={currentSlotInfo !== undefined}
        slotInfo={currentSlotInfo}
        addNewEvent={(newEvent: Event) => {
          setEvents((prev) => [...prev, newEvent]);
        }}
      />
      {currentEvent &&
        statusFromResource(currentEvent.resource) === 'Agendado' && (
          <ScheduledEventModal
            open={currentEvent !== undefined}
            handleClose={(reason: 'backdropClick' | 'escapeKeyDown' | '') =>
              reason !== 'backdropClick' &&
              reason !== 'escapeKeyDown' &&
              setCurrentEvent(undefined)
            }
            eventInfo={currentEvent}
          />
        )}
      {currentEvent &&
        statusFromResource(currentEvent.resource) === 'Confirmado' && (
          <ConfirmedEventModal
            open={currentEvent !== undefined}
            handleClose={(reason: 'backdropClick' | 'escapeKeyDown' | '') =>
              reason !== 'backdropClick' &&
              reason !== 'escapeKeyDown' &&
              setCurrentEvent(undefined)
            }
            eventInfo={currentEvent}
          />
        )}
      {currentEvent &&
        statusFromResource(currentEvent.resource) === 'Concluído' && (
          <ConcludedEventModal
            open={currentEvent !== undefined}
            handleClose={(reason: 'backdropClick' | 'escapeKeyDown' | '') =>
              reason !== 'backdropClick' &&
              reason !== 'escapeKeyDown' &&
              setCurrentEvent(undefined)
            }
            eventInfo={currentEvent}
          />
        )}
      {currentEvent &&
        (statusFromResource(currentEvent.resource) === 'Cancelado' ||
          statusFromResource(currentEvent.resource) === 'Ausência') && (
          <CancelledAbsenceEventModal
            open={currentEvent !== undefined}
            handleClose={(reason: 'backdropClick' | 'escapeKeyDown' | '') =>
              reason !== 'backdropClick' &&
              reason !== 'escapeKeyDown' &&
              setCurrentEvent(undefined)
            }
            eventInfo={currentEvent}
          />
        )}
      {currentEvent &&
        lockFromResource(currentEvent.resource) === 'LOCK' &&
        idFromResource(currentEvent.resource) && (
          <LockEventModal
            open={currentEvent !== undefined}
            handleClose={(reason: 'backdropClick' | 'escapeKeyDown' | '') =>
              reason !== 'backdropClick' &&
              reason !== 'escapeKeyDown' &&
              setCurrentEvent(undefined)
            }
            eventInfo={currentEvent}
          />
        )}
      <Calendar
        localizer={localizer}
        events={events}
        style={{ height: '100vh', width: '100%', fontFamily: 'Poppins' }}
        views={['day', 'week', 'month']}
        culture="pt-BR"
        step={currentProfessional?.baseDuration}
        defaultView="day"
        formats={{
          eventTimeRangeFormat: () => '', // HIDES TIME IN EVENTS
        }}
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
          statusFromResource(event.resource) && setCurrentEvent(event)
        }
        onSelectSlot={(slotInfo: SlotInfo) =>
          (user.permissions.includes('CREATE_APPOINTMENT') ||
            user.permissions.includes('CREATE_SCHEDULE_LOCK')) &&
          isAfter(slotInfo.start, new Date()) &&
          currentView === 'day' &&
          setCurrentSlotInfo(slotInfo)
        }
        selectable
        min={currentView === 'day' ? currentStart : undefined}
        max={currentView === 'day' ? currentEnd : undefined}
        onSelecting={() => false}
        popup={true}
        tooltipAccessor={() => ''}
        dayPropGetter={dayPropGetter}
        components={{
          toolbar:
            retrievedWeeklySchedule.length > 0
              ? (toolbar: ToolbarProps) =>
                  TopToolbar({
                    ...toolbar,
                    onRangeChange,
                  })
              : () => AlterTopToolbar(),
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
