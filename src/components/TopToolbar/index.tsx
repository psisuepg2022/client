/* eslint-disable quotes */
import React from 'react';
import {
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
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
import { ToolbarProps, View, Event } from 'react-big-calendar';
import { format, getDay } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import CardSelector from '../CardSelector';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/Auth';
import { useProfessionals } from '@contexts/Professionals';
import { useSchedule } from '@contexts/Schedule';
import { Professional } from '@models/Professional';
import { showAlert } from '@utils/showAlert';
import { WeeklySchedule } from '@models/WeeklySchedule';
import { ScheduleEvent } from '@interfaces/ScheduleEvent';
import {
  buildWeeklySchedule,
  buildWeeklyScheduleLocks,
  weekRange,
} from '@utils/schedule';
import { WeeklyScheduleLock } from '@models/WeeklyScheduleLock';

type CustomToolbarProps = {
  onRangeChange: (range: Date[], view?: View) => void;
} & ToolbarProps;

const TopToolbar = ({
  onRangeChange,
  onNavigate,
  onView,
  view,
  date,
}: CustomToolbarProps): JSX.Element => {
  const navigate = useNavigate();
  const {
    signOut,
    user: { permissions },
  } = useAuth();
  const { professionals } = useProfessionals();
  const {
    currentProfessional,
    setCurrentProfessional,
    setScheduleLoading,
    getScheduleEvents,
    setRetrievedWeeklySchedule,
    setEvents,
  } = useSchedule();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goToBack = () => {
    onNavigate('PREV');
  };

  const goToNext = () => {
    onNavigate('NEXT');
  };

  const goToCurrent = () => {
    onNavigate('TODAY');
    onView('day');
    onRangeChange([new Date()], 'day');
  };

  const onChangeProfessional = async (
    professional: Professional
  ): Promise<void> => {
    if (currentProfessional?.id === professional.id) return;
    setScheduleLoading(true);
    try {
      const currentDate = new Date();
      const [startOfWeek, endOfWeek] = weekRange(currentDate);
      const startOfWeekDate = format(startOfWeek, 'yyyy-MM-dd');
      const endOfWeekDate = format(endOfWeek, 'yyyy-MM-dd');
      setCurrentProfessional(professional);
      goToCurrent();
      const professionalSchedule = await getScheduleEvents(
        {
          startDate: startOfWeekDate,
          endDate: endOfWeekDate,
        },
        professional.id,
        true
      );
      const dayIndex = getDay(currentDate) + 1;
      const today = professionalSchedule?.content?.weeklySchedule.find(
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

      console.log('FIRST', professionalSchedule.content);

      const mappedScheduleLocks: Event[] =
        professionalSchedule?.content?.scheduleLocks.map((lock) => {
          const [day, month, year] = lock.date.split('/');
          const startDate = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
          );
          startDate.setHours(Number(lock.startTime.split(':')[0]));
          startDate.setMinutes(Number(lock.startTime.split(':')[1]));
          startDate.setSeconds(0);
          const endDate = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
          );
          endDate.setHours(Number(lock.endTime.split(':')[0]));
          endDate.setMinutes(Number(lock.endTime.split(':')[1]));
          endDate.setSeconds(0);

          return {
            start: startDate,
            end: endDate,
            resource: `${lock.resource}`,
            title: lock.id,
          };
        }) as Event[];

      console.log('MAPPED', mappedScheduleLocks);

      const mappedEvents: Event[] =
        professionalSchedule?.content?.appointments.map((event) => {
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
        }) as Event[];

      setRetrievedWeeklySchedule(
        professionalSchedule?.content?.weeklySchedule || []
      );
      setEvents([
        ...weeklyScheduleEvents,
        ...weeklyScheduleLocksEvents,
        ...mappedScheduleLocks,
        ...mappedEvents,
      ]);
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

  const label = () => {
    const toFormatDate = date;
    return (
      <DayTitle>
        {format(toFormatDate, "dd 'de' MMMM", { locale: ptBR })}{' '}
        {format(toFormatDate, 'yyyy', { locale: ptBR })}
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
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Container>
        <EarlyContent>
          <ClinicTitle>KLINIK</ClinicTitle>
        </EarlyContent>

        <MiddleContent>
          <IconButton onClick={goToBack}>
            <AiOutlineLeft style={{ color: '#FFF', fontSize: 30 }} />
          </IconButton>
          {label()}
          <IconButton onClick={goToNext}>
            <AiOutlineRight style={{ color: '#FFF', fontSize: 30 }} />
          </IconButton>
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
            <AiOutlineUser style={{ fontSize: 40, color: '#FFF' }} />
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
            <hr />
            <MenuItem onClick={signOut}>Logout</MenuItem>
          </Menu>
        </LatterContent>
      </Container>
      {!permissions.includes('USER_TYPE_PROFESSIONAL') && (
        <div style={{ display: 'flex' }}>
          {professionals.map((professional) => (
            <CardSelector
              key={professional.id}
              name={professional.name}
              selected={professional.id === currentProfessional?.id}
              onSelect={() => onChangeProfessional(professional)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopToolbar;
