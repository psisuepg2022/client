import React, { useEffect, useState } from 'react';
import { CircularProgress, IconButton, Typography } from '@mui/material';
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
import { UpdateWeeklySchedule, WeeklySchedule } from '@models/WeeklySchedule';
import CardSelector from '@components/CardSelector';
import SectionDivider from '@components/SectionDivider';
import { FormProvider, useForm } from 'react-hook-form';
import ControlledTimePicker from '@components/ControlledTimePicker';
import { timeToDate } from '@utils/timeToDate';
import { differenceInMinutes } from 'date-fns';
import CreateScheduleLockModal from '@components/CreateScheduleLockModal';
import { useAuth } from '@contexts/Auth';
import { dateFormat } from '@utils/dateFormat';

type FormLock = {
  id?: string;
  startTime: string;
  endTime: string;
  index?: number;
};

const ProfessionalSchedule = (): JSX.Element => {
  const navigate = useNavigate();
  const formMethods = useForm();
  const { user } = useAuth();
  const { reset, handleSubmit } = formMethods;
  const { getWeeklySchedule, updateWeeklySchedule, deleteLock } =
    useProfessionals();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentDay, setCurrentDay] = useState<WeeklySchedule>();
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule[]>([]);
  const [counter, setCounter] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [intervals, setIntervals] = useState<FormLock[]>([]);
  const [lockDelete, setLockDelete] = useState<number>(-1);
  const [savingWeekly, setSavingWeekly] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const { content } = await getWeeklySchedule();

        if (content && content.length > 0) {
          const initialDay = content[0] as WeeklySchedule;
          countLockSlots(initialDay);

          setWeeklySchedule(content);
          setCurrentDay(initialDay);
          setIntervals(initialDay.locks || []);
        }
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

  const countLockSlots = (day: WeeklySchedule): void => {
    const [start, end] = [day.startTime, day.endTime];
    const startTime = timeToDate(start);
    const endTime = timeToDate(end);
    const totalTime = differenceInMinutes(endTime, startTime);

    let totalLockTime = 0;
    day?.locks?.forEach((lock) => {
      const lockStartTime = timeToDate(lock.startTime);
      const lockEndTime = timeToDate(lock.endTime);

      totalLockTime += differenceInMinutes(lockEndTime, lockStartTime);
    });

    const slotsWithoutLock = totalTime / (user.baseDuration as number);
    const lockSlots = totalLockTime / (user.baseDuration as number);

    const remainingSlots = slotsWithoutLock - lockSlots;

    setCounter(remainingSlots);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any): Promise<void> => {
    const dayHours: { startTime: Date; endTime: Date } = data as {
      startTime: Date;
      endTime: Date;
    };
    const newIntervals = intervals.filter((item) => !item.id);
    const newWeeklySchedule: UpdateWeeklySchedule = {
      startTime: dateFormat({
        date: dayHours.startTime,
        stringFormat: 'HH:mm',
      }),
      endTime: dateFormat({
        date: dayHours.endTime,
        stringFormat: 'HH:mm',
      }),
      id: currentDay?.id as string,
      locks: newIntervals,
    };

    setSavingWeekly(true);
    try {
      const { content, message } = await updateWeeklySchedule(
        newWeeklySchedule
      );

      content && countLockSlots(content);

      showAlert({
        title: 'Sucesso!',
        icon: 'success',
        text: message,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        icon: 'error',
        text:
          e?.response?.data?.message ||
          'Ocorreu um problema ao salvar os horários ',
      });
    } finally {
      setSavingWeekly(false);
    }
  };

  const handleDayChange = (day: WeeklySchedule): void => {
    setCurrentDay(day);
    setIntervals(day.locks || []);
    reset({
      startTime: timeToDate(day.startTime),
      endTime: timeToDate(day.endTime),
    });
  };

  const removeInterval = async (interval: FormLock): Promise<void> => {
    if (interval.id) {
      showAlert({
        title: 'Tem certeza que deseja deletar?',
        text: 'Este intervalo já está salvo',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: colors.DANGER,
        confirmButtonText: 'DELETAR',
        cancelButtonColor: colors.BACKGREY,
        cancelButtonText: '<span style="color: #000;"> CANCELAR</span>',
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            setLockDelete(interval.index as number);
            await deleteLock(currentDay?.id as string, interval?.id as string);
            setIntervals((prev) => {
              const newIntervals = [...prev];
              newIntervals.splice(interval.index as number, 1);

              return newIntervals;
            });
            setCounter((prev) => prev + 1);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (e: any) {
            showAlert({
              text:
                e?.response?.data?.message ||
                'Ocorreu um problema deletar o intervalo',
              icon: 'error',
            });
          } finally {
            setLockDelete(-1);
          }
        }
      });
      return;
    }
    setIntervals((prev) => {
      const newIntervals = [...prev];
      newIntervals.splice(interval.index as number, 1);

      return newIntervals;
    });
    setCounter((prev) => prev + 1);
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
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
                    disabled={loading || lockDelete !== -1 || savingWeekly}
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
                      <TimesLabel>Intervalos - {counter} restantes</TimesLabel>
                      <IconButton
                        size="small"
                        style={{ width: 60, height: 60, marginLeft: 20 }}
                        onClick={() => setOpenModal(true)}
                        disabled={loading || lockDelete !== -1 || savingWeekly}
                      >
                        <AiOutlinePlus
                          size={40}
                          style={{ color: colors.PRIMARY }}
                        />
                      </IconButton>
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
                            disabled={
                              loading || lockDelete !== -1 || savingWeekly
                            }
                            style={{ width: 60, height: 60, marginLeft: 20 }}
                            onClick={() => removeInterval({ ...lock, index })}
                          >
                            {lockDelete === index ? (
                              <CircularProgress
                                size={20}
                                style={{ color: colors.PRIMARY }}
                              />
                            ) : (
                              <MdDelete
                                size={40}
                                style={{ color: colors.PRIMARY }}
                              />
                            )}
                          </IconButton>
                        </IntervalsContainer>
                      ))}
                  </form>
                </FormProvider>
              )}
            </DayHoursAndLocks>
          </div>
          <StyledButton
            disabled={loading || lockDelete !== -1 || savingWeekly}
            type="submit"
            form="form"
          >
            {savingWeekly ? (
              <CircularProgress size={20} style={{ color: '#FFF' }} />
            ) : (
              'SALVAR'
            )}
          </StyledButton>
        </Content>
      </Box>
    </Container>
  );
};

export default ProfessionalSchedule;
