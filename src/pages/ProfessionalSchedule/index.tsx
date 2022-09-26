import React, { useEffect, useState } from 'react';
import { IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Content,
  DayHoursAndLocks,
  Header,
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
import { WeeklyScheduleLock } from '@models/WeeklyScheduleLock';
import { differenceInMinutes } from 'date-fns';
import { useSchedule } from '@contexts/Schedule';

type FormLock = {
  id?: string;
  startTime: string;
  endTime: string;
};

const ProfessionalSchedule = (): JSX.Element => {
  const navigate = useNavigate();
  const formMethods = useForm();
  const { reset, handleSubmit } = formMethods;
  const { getWeeklySchedule } = useProfessionals();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentDay, setCurrentDay] = useState<WeeklySchedule>();
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule[]>([]);
  const [intervals, setIntervals] = useState<FormLock[]>([]);
  const [counter, setCounter] = useState<number>(0);

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

          console.log('DIFF', startTime, endTime, totalTime);
          console.log('LOCK TOTAL', totalLockTime);

          const slotsWithoutLock = totalTime / 60;
          const lockSlots = totalLockTime / 60;

          const remainingSlots = slotsWithoutLock - lockSlots;

          console.log('SUMA', slotsWithoutLock, lockSlots, remainingSlots);

          setWeeklySchedule(content);
          setCurrentDay(initialDay);
          setIntervals(initialDay.locks as FormLock[]);
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

  const onSubmit = (data: any) => {
    console.log('data', data, intervals);
  };

  const addInterval = (): void => {
    setIntervals((prev) => [...prev, { startTime: '12:00', endTime: '13:00' }]);
  };

  const removeInterval = (lock: WeeklyScheduleLock): void => {
    // setIndexes(prevIndexes => [...prevIndexes.filter(item => item !== index)]);
    // setCounter(prevCounter => prevCounter - 1);
  };

  const handleDayChange = (day: WeeklySchedule): void => {
    setCurrentDay(day);
    setIntervals(day.locks as FormLock[]);
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
                      required
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
                      required
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
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <TimesLabel>Intervalos</TimesLabel>
                    <TimesLabel>{counter} intervalos restantes</TimesLabel>
                  </div>
                  {currentDay &&
                    intervals &&
                    intervals.length > 0 &&
                    intervals.map((lock, index) => (
                      <IntervalsContainer key={index}>
                        <ControlledTimePicker
                          label="Início"
                          name={`${index}.startTime`}
                          defaultValue={timeToDate(lock.startTime)}
                          rules={{
                            required: {
                              value: true,
                              message: 'O tempo de início é obrigatório',
                            },
                          }}
                        />
                        <ControlledTimePicker
                          label="Fim"
                          name={`${index}.endTime`}
                          defaultValue={timeToDate(lock.endTime)}
                          rules={{
                            required: {
                              value: true,
                              message: 'O tempo final é obrigatório',
                            },
                          }}
                        />
                        {index === 0 ? (
                          <IconButton
                            size="small"
                            style={{ width: 60, height: 60, marginLeft: 20 }}
                            onClick={addInterval}
                          >
                            <AiOutlinePlus
                              size={40}
                              style={{ color: colors.PRIMARY }}
                            />
                          </IconButton>
                        ) : (
                          <IconButton
                            size="small"
                            style={{ width: 60, height: 60, marginLeft: 20 }}
                            onClick={addInterval}
                          >
                            <MdDelete
                              size={40}
                              style={{ color: colors.PRIMARY }}
                            />
                          </IconButton>
                        )}
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
