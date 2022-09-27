import React, { useEffect, useState } from 'react';
import { IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Content,
  DayHoursAndLocks,
  Header,
  IntervalRow,
  IntervalsContainer,
  LogoContainer,
  StyledButton,
  TimesLabel,
  WorkHoursContainer,
} from './styles';
import { FiChevronLeft } from 'react-icons/fi';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { colors } from '@global/colors';
import { showAlert } from '@utils/showAlert';
import { useProfessionals } from '@contexts/Professionals';
import CircularProgressWithContent from '@components/CircularProgressWithContent';
import logoPSIS from '@assets/PSIS-Logo-Invertido-Transparente.png';
import { WeeklySchedule } from '@models/WeeklySchedule';
import CardSelector from '@components/CardSelector';
import SectionDivider from '@components/SectionDivider';
import { FormProvider, useForm } from 'react-hook-form';
import ControlledTimePicker from '@components/ControlledTimePicker';
import { timeToDate } from '@utils/timeToDate';
import { differenceInMinutes } from 'date-fns';
import CreateScheduleLockModal from '@components/CreateScheduleLockModal';
import { useAuth } from '@contexts/Auth';

type FormLock = {
  id?: string;
  startTime: string;
  endTime: string;
};

const ProfessionalSchedule = (): JSX.Element => {
  const navigate = useNavigate();
  const formMethods = useForm();
  const { user } = useAuth();
  const { reset, handleSubmit } = formMethods;
  const { getWeeklySchedule } = useProfessionals();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentDay, setCurrentDay] = useState<WeeklySchedule>();
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule[]>([]);
  const [counter, setCounter] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [intervals, setIntervals] = useState<FormLock[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { content } = await getWeeklySchedule();

        if (content && content.length > 0) {
          const initialDay = content[0] as WeeklySchedule;
          const [start, end] = [initialDay.startTime, initialDay.endTime];
          const startTime = timeToDate(start);
          const endTime = timeToDate(end);
          const totalTime = differenceInMinutes(endTime, startTime);

          let totalLockTime = 0;
          initialDay?.locks?.forEach((lock) => {
            const lockStartTime = timeToDate(lock.startTime);
            const lockEndTime = timeToDate(lock.endTime);

            totalLockTime += differenceInMinutes(lockEndTime, lockStartTime);
          });

          const slotsWithoutLock = totalTime / (user.baseDuration as number);
          const lockSlots = totalLockTime / (user.baseDuration as number);

          const remainingSlots = slotsWithoutLock - lockSlots;

          setCounter(remainingSlots);

          setWeeklySchedule(content);
          setCurrentDay(initialDay);
          setIntervals(initialDay.locks || []);
        }
        console.log('WEEKYL', content);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        showAlert({
          icon: 'error',
          text:
            e?.response?.data?.message ||
            'Ocorreu um problema ao recuperar os horários do profissional',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    const dayHours: FormLock = data as FormLock;
    console.log('data', dayHours);
  };

  const handleDayChange = (day: WeeklySchedule): void => {
    setCurrentDay(day);
    setIntervals(day.locks || []);
    reset({
      startTime: timeToDate(day.startTime),
      endTime: timeToDate(day.endTime),
    });
  };

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
    <Container>
      <CreateScheduleLockModal
        open={openModal}
        handleClose={(reason: 'backdropClick' | 'escapeKeyDown' | '') =>
          reason !== 'backdropClick' &&
          reason !== 'escapeKeyDown' &&
          setOpenModal(false)
        }
        addNewLock={(lock) => {
          setIntervals((prev) => [...prev, lock]);
          setCounter((prev) => prev - 1);
        }}
        checkDuplicates={(lock) => {
          const findDuplicates = intervals.find(
            (interval) =>
              (lock.startTime === interval.startTime &&
                lock.endTime === interval.endTime) ||
              lock.startTime === interval.startTime
          );

          return findDuplicates === undefined ? false : true;
        }}
      />
      <Box>
        <Content>
          <Header>
            <IconButton onClick={() => navigate(-1)}>
              <FiChevronLeft
                style={{ color: colors.TEXT, fontSize: '2.5rem' }}
              />
            </IconButton>
            <Typography fontSize={'2.5rem'}>
              Horários do Profissional
            </Typography>
          </Header>

          <SectionDivider>Dias da semana</SectionDivider>

          <DayHoursAndLocks>
            <div style={{ display: 'flex', marginTop: 30 }}>
              {weeklySchedule.map((item) => (
                <CardSelector
                  key={item.id}
                  name={`${item.dayOfTheWeek}`}
                  selected={currentDay?.id === item.id}
                  onSelect={() => handleDayChange(item)}
                  disabled={loading}
                  style={{ padding: '0.3rem' }}
                  textStyle={{
                    color: colors.TEXT,
                    fontWeight: '600',
                    textTransform: 'none',
                  }}
                />
              ))}
            </div>
            {currentDay && (
              <FormProvider {...formMethods}>
                <form id="form" onSubmit={handleSubmit(onSubmit)}>
                  <TimesLabel>Início e fim do expediente</TimesLabel>
                  <WorkHoursContainer>
                    <ControlledTimePicker
                      label="Início"
                      name="startTime"
                      defaultValue={timeToDate(currentDay.startTime)}
                      rules={{
                        required: {
                          value: true,
                          message: 'O tempo de início é obrigatório',
                        },
                      }}
                    />
                    <ControlledTimePicker
                      label="Fim"
                      name="endTime"
                      defaultValue={timeToDate(currentDay.endTime)}
                      rules={{
                        required: {
                          value: true,
                          message: 'O tempo final é obrigatório',
                        },
                      }}
                    />
                  </WorkHoursContainer>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <TimesLabel>Intervalos</TimesLabel>
                    <IconButton
                      size="small"
                      style={{ width: 60, height: 60, marginLeft: 20 }}
                      onClick={() => setOpenModal(true)}
                    >
                      <AiOutlinePlus
                        size={40}
                        style={{ color: colors.PRIMARY }}
                      />
                    </IconButton>
                    <TimesLabel>{counter} intervalos restantes</TimesLabel>
                  </div>
                  {intervals &&
                    intervals.length > 0 &&
                    intervals.map((lock, index) => (
                      <IntervalsContainer key={index}>
                        <IntervalRow>
                          Início: <span>{lock.startTime}</span>
                        </IntervalRow>
                        <IntervalRow>
                          Fim: <span>{lock.endTime}</span>
                        </IntervalRow>
                        <IconButton
                          size="small"
                          style={{ width: 60, height: 60, marginLeft: 20 }}
                        >
                          <MdDelete
                            size={40}
                            style={{ color: colors.PRIMARY }}
                          />
                        </IconButton>
                      </IntervalsContainer>
                    ))}
                </form>
              </FormProvider>
            )}
          </DayHoursAndLocks>
          <StyledButton type="submit" form="form">
            SALVAR
          </StyledButton>
        </Content>
      </Box>
    </Container>
  );
};

export default ProfessionalSchedule;
