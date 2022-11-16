/* eslint-disable quotes */
import React, { useEffect, useState } from 'react';
import {
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import {
  CardContainer,
  ClinicTitle,
  Container,
  DayTitle,
  EarlyContent,
  LatterContent,
  MiddleContent,
  StyledInputLabel,
  StyledMenuItem,
  StyledSelect,
  TodayButton,
} from './styles';
import { AiOutlineUser, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { FaUserCog, FaUserMd, FaUserTie } from 'react-icons/fa';
import { ToolbarProps, View, Event } from 'react-big-calendar';
import CardSelector from '../CardSelector';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/Auth';
import { useProfessionals } from '@contexts/Professionals';
import { useSchedule } from '@contexts/Schedule';
import { Professional } from '@models/Professional';
import { showAlert } from '@utils/showAlert';
import { WeeklySchedule } from '@models/WeeklySchedule';
import { weekRange } from '@utils/schedule';
import { dateFormat } from '@utils/dateFormat';
import {
  addDays,
  addMonths,
  addWeeks,
  getDay,
  isAfter,
  isEqual,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import LiableHelpModal from '@components/LiableHelpModal';
import { Holiday } from '@interfaces/Holiday';

type CustomToolbarProps = {
  onRangeChange: (range: Date[], view?: View) => void;
  setDate: (date: Date) => void;
  disabled?: boolean;
} & ToolbarProps;

const TopToolbar = ({
  onRangeChange,
  onNavigate,
  onView,
  view,
  date,
  setDate,
  disabled,
}: CustomToolbarProps): JSX.Element => {
  const navigate = useNavigate();
  const {
    signOut,
    user: { permissions, clinic },
  } = useAuth();
  const { professionals } = useProfessionals();
  const {
    currentProfessional,
    setCurrentProfessional,
    setScheduleLoading,
    getScheduleEvents,
    setRetrievedWeeklySchedule,
    setEvents,
    setCurrentEnd,
    setCurrentStart,
    getHolidays,
    setCurrentHoliday,
    currentHoliday,
  } = useSchedule();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [holidayWarning, setHolidayWarning] = useState<boolean>(false);

  useEffect(() => {
    const gotDate = new Date(date);
    gotDate.setHours(0, 0, 0, 0);

    if (currentHoliday) {
      const [prevYear, prevMonth, prevDay] = currentHoliday?.date.split('-');
      const prevHoliday = new Date(
        Number(prevYear),
        Number(prevMonth) - 1,
        Number(prevDay)
      );

      prevHoliday.setHours(0, 0, 0, 0);

      if (isEqual(prevHoliday, gotDate)) return;
    }

    const year = date.getFullYear();
    const storedYear = localStorage.getItem('@psis:holidaysYear');
    if (`${year}` !== storedYear) {
      (async () => {
        try {
          const holidays = await getHolidays(`${year}`);

          localStorage.setItem('@psis:holidaysYear', `${year}`);
          localStorage.setItem('@psis:holidays', JSON.stringify(holidays));

          holidays.find((holiday) => {
            const [year, month, day] = holiday.date.split('-');
            const holidayDate = new Date(
              Number(year),
              Number(month) - 1,
              Number(day)
            );
            if (isEqual(holidayDate, gotDate)) {
              setCurrentHoliday(holiday);
            } else {
              currentHoliday !== undefined && setCurrentHoliday(undefined);
            }
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          console.log('ERROR', e);
        }
      })();

      return;
    }

    const storedHolidays = localStorage.getItem('@psis:holidays');

    if (storedHolidays) {
      const holidays: Holiday[] = JSON.parse(storedHolidays) as Holiday[];
      holidays.find((holiday) => {
        const [year, month, day] = holiday.date.split('-');
        const holidayDate = new Date(
          Number(year),
          Number(month) - 1,
          Number(day)
        );
        if (isEqual(holidayDate, gotDate)) {
          setCurrentHoliday(holiday);
        } else {
          currentHoliday !== undefined && setCurrentHoliday(undefined);
        }
      });
    }
  }, [date]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goToBack = () => {
    switch (view) {
      case 'day': {
        const newDate = subDays(date, 1);
        if (disabled) onNavigate('PREV', newDate);
        else onNavigate('PREV');
        setDate(newDate);
        break;
      }
      case 'week': {
        const newDate = subWeeks(date, 1);
        onNavigate('PREV');
        setDate(newDate);
        break;
      }
      case 'month': {
        const newDate = subMonths(date, 1);
        onNavigate('PREV');
        setDate(newDate);
        break;
      }
      default: {
        const newDate = subDays(date, 1);
        if (disabled) onNavigate('PREV', newDate);
        else onNavigate('PREV');
        setDate(newDate);
        break;
      }
    }
  };

  const goToNext = () => {
    switch (view) {
      case 'day': {
        const newDate = addDays(date, 1);
        if (disabled) onNavigate('NEXT', newDate);
        else onNavigate('NEXT');
        setDate(newDate);
        break;
      }
      case 'week': {
        const newDate = addWeeks(date, 1);
        onNavigate('NEXT');
        setDate(newDate);
        break;
      }
      case 'month': {
        const newDate = addMonths(date, 1);
        onNavigate('NEXT');
        setDate(newDate);
        break;
      }
      default: {
        const newDate = addDays(date, 1);
        if (disabled) onNavigate('NEXT', newDate);
        else onNavigate('NEXT');
        setDate(newDate);
        break;
      }
    }
  };

  const goToCurrent = () => {
    const newDate = new Date();
    newDate.setHours(0, 0, 0);
    setDate(newDate);
    // if (disabled) onNavigate('TODAY', newDate);
    // else onNavigate('TODAY');
    onView('day');
    onRangeChange([newDate], 'day');
  };

  const onChangeProfessional = async (
    professional: Professional
  ): Promise<void> => {
    if (currentProfessional?.id === professional.id) return;
    setScheduleLoading(true);
    goToCurrent();
    setEvents([]);
    setRetrievedWeeklySchedule([]);
    try {
      const currentDate = new Date();
      const [startOfWeek, endOfWeek] = weekRange(currentDate);
      const startOfWeekDate = dateFormat({
        date: startOfWeek,
        stringFormat: 'yyyy-MM-dd',
      });
      const endOfWeekDate = dateFormat({
        date: endOfWeek,
        stringFormat: 'yyyy-MM-dd',
      });
      setCurrentProfessional(professional);
      const professionalSchedule = await getScheduleEvents(
        {
          startDate: startOfWeekDate,
          endDate: endOfWeekDate,
        },
        professional.id,
        true
      );
      if (
        professionalSchedule.content &&
        professionalSchedule.content?.weeklySchedule.length > 0
      ) {
        const dayIndex = getDay(currentDate) + 1;
        const today = professionalSchedule?.content?.weeklySchedule.find(
          (item) => item.dayOfTheWeek === dayIndex
        ) as WeeklySchedule;

        if (today.startTime && today.endTime) {
          const initialStart = new Date();
          initialStart.setHours(
            Number(today.startTime.split(':')[0]),
            Number(today.startTime.split(':')[1]),
            0
          );
          const initialEnd = new Date();
          initialEnd.setHours(
            Number(today.endTime.split(':')[0]),
            Number(today.endTime.split(':')[1]),
            0
          );

          setCurrentStart(initialStart);
          setCurrentEnd(initialEnd);
        } else {
          const initialStart = new Date();
          initialStart.setHours(0, 0, 0);

          const initialEnd = new Date();
          initialEnd.setHours(0, 0, 0);

          setCurrentStart(initialStart);
          setCurrentEnd(initialEnd);
        }

        // const weeklyScheduleEvents: ScheduleEvent[] = buildWeeklySchedule(
        //   currentDate,
        //   today
        // ) as ScheduleEvent[];

        const weeklyScheduleLocksEvents: Event[] = [];
        today?.locks?.forEach((lock) => {
          const lockStart = new Date(date);
          lockStart.setHours(
            Number(lock.startTime.split(':')[0]),
            Number(lock.startTime.split(':')[1]),
            0
          );

          const lockEnd = new Date(date);
          lockEnd.setHours(
            Number(lock.endTime.split(':')[0]),
            Number(lock.endTime.split(':')[1]),
            0
          );

          if (isAfter(lockStart, currentDate)) {
            const lockEvent: Event = {
              resource: 'LOCK',
              start: lockStart,
              end: lockEnd,
            };

            weeklyScheduleLocksEvents.push(lockEvent);
            return;
          }
          if (isAfter(lockEnd, currentDate)) {
            const lockEvent: Event = {
              resource: 'LOCK',
              start: new Date(),
              end: lockEnd,
            };

            weeklyScheduleLocksEvents.push(lockEvent);
            return;
          }
        });

        const mappedScheduleLocks: Event[] =
          professionalSchedule?.content?.scheduleLocks.map((lock) => {
            const [day, month, year] = lock.date.split('/');
            const startDate = new Date(
              Number(year),
              Number(month) - 1,
              Number(day)
            );
            startDate.setHours(
              Number(lock.startTime.split(':')[0]),
              Number(lock.startTime.split(':')[1]),
              0
            );
            const endDate = new Date(
              Number(year),
              Number(month) - 1,
              Number(day)
            );
            endDate.setHours(
              Number(lock.endTime.split(':')[0]),
              Number(lock.endTime.split(':')[1]),
              0
            );

            if (
              isAfter(endDate, currentDate) ||
              isEqual(endDate, currentDate)
            ) {
              return {
                start: startDate,
                end: endDate,
                resource: `${lock.resource}/${lock.id}`,
                title: lock.id,
              };
            }
          }) as Event[];

        const validScheduleLocks: Event[] = mappedScheduleLocks.filter(
          (lock) => lock
        );

        const mappedEvents: Event[] =
          professionalSchedule?.content?.appointments.map((event) => {
            const startTime = event.startDate.split('T')[1].substring(0, 5);
            const startDate = new Date(event.startDate);
            startDate.setHours(
              Number(startTime.split(':')[0]),
              Number(startTime.split(':')[1]),
              0
            );
            const endTime = event.endDate.split('T')[1].substring(0, 5);
            const endDate = new Date(event.endDate);
            endDate.setHours(
              Number(endTime.split(':')[0]),
              Number(endTime.split(':')[1]),
              0
            );
            return {
              start: startDate,
              end: endDate,
              title: event.title,
              resource: event?.updatedAt
                ? `${event.resource}/${event.contactNumber}/${event.id}/${event.updatedAt}`
                : `${event.resource}/${event.contactNumber}/${event.id}`,
            };
          }) as Event[];

        setRetrievedWeeklySchedule(
          professionalSchedule?.content?.weeklySchedule || []
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
      showAlert({
        icon: 'error',
        text:
          e?.response?.data?.message ||
          'Ocorreu um problema ao recuperar as consultas',
      });
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleViewChange = (value: number): void => {
    switch (value) {
      case 0:
        onView('day');
        break;
      case 1:
        onView('week');
        break;
      case 2:
        onView('month');
        break;
    }
  };

  const dayLabel = () => {
    const toFormatDate = date;
    return (
      <DayTitle>
        {dateFormat({ date: toFormatDate, stringFormat: "dd 'de' MMMM" })}{' '}
        {dateFormat({ date: toFormatDate, stringFormat: 'yyyy' })}
      </DayTitle>
    );
  };

  if (
    !permissions.includes('USER_TYPE_PROFESSIONAL') &&
    professionals?.length === 0 &&
    !currentProfessional
  )
    return <></>;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%',
      }}
    >
      <Container>
        {holidayWarning && (
          <LiableHelpModal
            open={holidayWarning}
            handleClose={() => setHolidayWarning(false)}
          />
        )}
        <EarlyContent>
          <ClinicTitle>{clinic?.name}</ClinicTitle>
        </EarlyContent>

        <MiddleContent>
          <Tooltip title="Anterior">
            <IconButton onClick={goToBack}>
              <AiOutlineLeft style={{ color: '#FFF', fontSize: 30 }} />
            </IconButton>
          </Tooltip>
          {dayLabel()}
          <Tooltip title="Próximo">
            <IconButton onClick={goToNext}>
              <AiOutlineRight style={{ color: '#FFF', fontSize: 30 }} />
            </IconButton>
          </Tooltip>
        </MiddleContent>

        <LatterContent>
          {(date.getDate() !== new Date().getDate() ||
            date.getMonth() !== new Date().getMonth() ||
            date.getFullYear() !== new Date().getFullYear()) && (
            <TodayButton onClick={goToCurrent} variant="outlined">
              Hoje
            </TodayButton>
          )}
          <FormControl>
            <StyledInputLabel shrink>Modo</StyledInputLabel>
            <StyledSelect
              name="mode"
              label="Modo"
              notched
              defaultValue={0}
              onChange={(e: SelectChangeEvent<unknown>) =>
                handleViewChange(e.target.value as number)
              }
              value={view === 'day' ? 0 : view === 'week' ? 1 : 2}
            >
              <StyledMenuItem value={0}>Dia</StyledMenuItem>
              <StyledMenuItem value={1}>Semana</StyledMenuItem>
              <StyledMenuItem value={2}>Mês</StyledMenuItem>
            </StyledSelect>
          </FormControl>
          <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              open ? handleClose() : handleClick(e)
            }
          >
            {permissions.includes('USER_TYPE_PROFESSIONAL') ? (
              <FaUserMd style={{ fontSize: 35, color: '#FFF' }} />
            ) : permissions.includes('USER_TYPE_EMPLOYEE') ? (
              <FaUserTie style={{ fontSize: 35, color: '#FFF' }} />
            ) : permissions.includes('USER_TYPE_OWNER') ? (
              <FaUserCog style={{ fontSize: 40, color: '#FFF' }} />
            ) : (
              <AiOutlineUser style={{ fontSize: 40, color: '#FFF' }} />
            )}
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            sx={{ zIndex: 999 }}
          >
            <MenuItem onClick={() => navigate('/profile')}>Perfil</MenuItem>
            <MenuItem onClick={() => navigate('/profile/change-password')}>
              Alterar Senha
            </MenuItem>
            <hr />
            <MenuItem onClick={signOut}>Sair</MenuItem>
          </Menu>
        </LatterContent>
      </Container>
      {!permissions.includes('USER_TYPE_PROFESSIONAL') && (
        <CardContainer
          sx={{
            gridAutoFlow: 'column',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(200px,1fr)) !important',
            gridAutoColumns: 'minmax(200px, 1fr)',
          }}
        >
          {professionals.map((professional) => (
            <CardSelector
              key={professional.id}
              name={professional.name}
              selected={professional.id === currentProfessional?.id}
              onSelect={() => onChangeProfessional(professional)}
              professionals
            />
          ))}
        </CardContainer>
      )}
    </div>
  );
};

export default TopToolbar;
