import React, { useCallback, useState } from 'react';
import {
  Calendar,
  Event,
  dateFnsLocalizer,
  View,
  Messages,
  ToolbarProps,
  HeaderProps,
  EventProps,
  DateHeaderProps,
  SlotPropGetter,
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
import { AgendaHours } from '../../types';
import TopToolbar from '../TopToolbar';
import { CustomDateHeaderContainer } from './styles';

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
  weekAgenda: AgendaHours[];
};

type Ranges = {
  start: Date;
  end: Date;
};

const Schedule = ({ givenEvents, weekAgenda }: ScheduleProps): JSX.Element => {
  const [events, setEvents] = useState<Event[]>(givenEvents);

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
        //console.log('EACH DAYS: ', eachDay)

        eachDay.forEach((date: Date) => {
          const today = getDay(date);
          const dayHour = weekAgenda.find(
            (item) => item.dayOfTheWeek === today
          );

          const newHours: Event[] = [
            {
              resource: 'lock',
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
                Number(dayHour?.start.split(':')[0]),
                Number(dayHour?.start.split(':')[1]),
                0
              ),
            },
            {
              resource: 'lock',
              start: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                Number(dayHour?.end.split(':')[0]),
                Number(dayHour?.end.split(':')[1]),
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

          const newLocks: Event[] = dayHour?.restrictions.map((item) => {
            const startDate = new Date(date.getTime());
            startDate.setHours(Number(item.start.split(':')[0]));
            startDate.setMinutes(Number(item.start.split(':')[1]));
            startDate.setSeconds(0);

            const endDate = new Date(date.getTime());
            endDate.setHours(Number(item.end.split(':')[0]));
            endDate.setMinutes(Number(item.end.split(':')[1]));
            endDate.setSeconds(0);

            console.log('NEW LOCKS', newLocks);
            return {
              start: startDate,
              end: endDate,
              resource: 'lock',
              title: 'Almoço',
            };
          }) as Event[];

          hours.push(...newHours);
          locks.push(...newLocks);
        });

        // console.log('MONTH 1: ', hours)
        // console.log('MONTH 2: ', locks)
        setEvents((prev) => {
          const removeOldLocks = prev.filter(
            (item) => item.resource !== 'lock'
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
            resource: 'lock',
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
              Number(dayHour?.start.split(':')[0]),
              Number(dayHour?.start.split(':')[1]),
              0
            ),
          },
          {
            resource: 'lock',
            start: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              Number(dayHour?.end.split(':')[0]),
              Number(dayHour?.end.split(':')[1]),
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

        const newLocks: Event[] = dayHour?.restrictions.map((item) => {
          const startDate = new Date(date.getTime());
          startDate.setHours(Number(item.start.split(':')[0]));
          startDate.setMinutes(Number(item.start.split(':')[1]));
          startDate.setSeconds(0);
          const endDate = new Date(date.getTime());
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

        console.log('NEW LOCKSA', newLocks);

        allEvents.push(...newHours);
        allEvents.push(...newLocks);
      });
      //console.log('all', allEvents)
      setEvents((prev) => {
        const removeOldLocks = prev.filter((item) => item.resource !== 'lock');

        return [...removeOldLocks, ...allEvents];
      });
    },
    []
  );

  const eventStyleGetter = (
    event: Event,
    start: Date,
    end: Date,
    isSelected: boolean
  ): { style?: Record<string, unknown>; className?: string } => {
    if (event.resource && event.resource === 'lock') {
      const style = {
        backgroundColor: '#9BB0A5',
        borderRadius: '0px',
        color: 'transparent',
        cursor: 'auto',
        width: '100%',
        border: '1px',
      };

      return {
        style: style,
        className: 'eventDefault',
      };
    }

    const style = {
      backgroundColor: '#81a57d',
      borderRadius: '2px',
      color: '#161616',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    };

    return {
      style: style,
      className: 'eventDefault',
    };
  };

  const CustomDateHeader = ({
    label,
    drilldownView,
    onDrillDown,
    date,
    isOffRange,
  }: DateHeaderProps) => {
    const eventsInDate = events.reduce(
      (prev, cur) =>
        cur.start?.getDate() === date.getDate() &&
        cur.start.getMonth() === date.getMonth() &&
        cur.start.getFullYear() === date.getFullYear() &&
        cur.resource !== 'lock'
          ? prev + 1
          : prev,
      0
    );

    return (
      <CustomDateHeaderContainer>
        <div
          style={{
            backgroundColor: '#385f3b',
            borderRadius: 20,
            width: 40,
            height: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <p style={{ fontWeight: 'bold', fontSize: 18, color: '#FFF' }}>
            {eventsInDate}
          </p>
        </div>
        <a
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            textDecoration: 'none',
            position: 'absolute',
            right: 0,
            top: 15,
            color: '#202020',
          }}
          href="#"
          onClick={onDrillDown}
        >
          {label}
        </a>
      </CustomDateHeaderContainer>
    );
  };

  function CustomHeaderMonth({ date, label, localizer }: HeaderProps) {
    return (
      <div>
        <p>{label}</p>
      </div>
    );
  }

  function CustomEventMonth({
    continuesAfter,
    continuesPrior,
    event,
    isAllDay,
    localizer,
    slotEnd,
    slotStart,
    title,
  }: EventProps) {
    return <div></div>;
  }

  const slotPropGetter: SlotPropGetter = useCallback(
    (date: Date, resourceId?: string | number | undefined) => {
      return {
        className: 'slot-non-click',
        style: {
          backgroundColor: '#FFF',
          color: '#141414',
          pointerEvents: 'none',
        },
      };
    },
    []
  );

  const dayPropGetter = useCallback(
    (date: Date): { style?: Record<string, unknown>; className?: string } => {
      return {
        className: '',
        style: {},
      };
    },
    []
  );

  console.log('EVEEEENTS', events);

  return (
    <Calendar
      localizer={localizer}
      events={events}
      style={{ height: '100vh', width: '100%', fontFamily: 'Poppins' }}
      views={['day', 'week', 'month']}
      culture="pt-BR"
      step={60}
      defaultView="day"
      formats={{
        eventTimeRangeFormat: () => '', // HIDES TIME IN EVENTS
      }}
      timeslots={1}
      // onView={onViewChange}
      // date={currentDate}
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
      // onDrillDown={(date: Date, view: View) => onRangeChange([date], view)}
      // min={getDayMin()}
      // min={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 8, 0, 0)}
      // max={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 15, 0, 0)}
      slotPropGetter={slotPropGetter}
      eventPropGetter={eventStyleGetter}
      // onSelectSlot={(slotInfo: SlotInfo) => setCurrentSlot(slotInfo)}
      messages={messages}
      // onSelectEvent={(event: Event) =>
      //   event?.resource !== 'lock' && setOpenContext(true)
      // }
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
        //dateCellWrapper: CustomDay
        // eventWrapper: (event) => {
        //   console.log('evne', event.className)
        //   return (
        //       <div className={event.className} style={{ height: 4.166666666666686,
        //         top: 79.16666666666666,
        //         width: 100,
        //         xOffset: 0, backgroundColor: '#F00', cursor: 'pointer' }}>
        //         <p>{event.event.title}</p>
        //       </div>

        //   )
        // }
        month: {
          dateHeader: CustomDateHeader,
          header: CustomHeaderMonth,
          event: CustomEventMonth,
        },
        eventWrapper: (props: any) => {
          const { event, children, style } = props;

          console.log('PROSP', props);
          return (
            <div
            // onClick={e => {
            //   console.log("ON CHICKE',", e)
            //   handleClick(e)
            // }}
            // onContextMenu={(e) => {
            //   // alert(`${event.title} is clicked.`);
            //   console.log('ON KINVERTE\',', e);
            //   handleClick(e);
            //   e.preventDefault();
            // }}
            // className={children.props.className}
            // style={{ ...children.props.style }}
            >
              {children}
            </div>
          );
        },
        // }}
      }}
    />
  );
};

export default Schedule;
