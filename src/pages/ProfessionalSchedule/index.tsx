import React, { useEffect, useState } from 'react';
import {
  CircularProgress,
  FormControlLabel,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
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
  StyledCheckbox,
  TimesLabel,
  WorkHoursContainer,
} from './styles';
import { FiChevronLeft } from 'react-icons/fi';
import {
  AiOutlinePlus,
  AiOutlineQuestionCircle,
  AiOutlineRight,
} from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { colors } from '@global/colors';
import { showAlert } from '@utils/showAlert';
import { useProfessionals } from '@contexts/Professionals';
import CircularProgressWithContent from '@components/CircularProgressWithContent';
import logoPSIS from '@assets/PSIS-Logo-Invertido-Transparente.png';
import { UpdateWeeklySchedule, WeeklySchedule } from '@models/WeeklySchedule';
import CardSelector from '@components/CardSelector';
import SectionDivider from '@components/SectionDivider';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import ControlledTimePicker from '@components/ControlledTimePicker';
import { timeToDate } from '@utils/timeToDate';
import { differenceInMinutes } from 'date-fns';
import CreateScheduleLockModal from '@components/CreateScheduleLockModal';
import { useAuth } from '@contexts/Auth';
import { dateFormat } from '@utils/dateFormat';
import { DaysOfTheWeek } from '@interfaces/DaysOfTheWeek';
import { WeeklyScheduleLock } from '@models/WeeklyScheduleLock';
import { showToast } from '@utils/showToast';
import ProfessionalScheduleDaysHelp from '@components/ProfessionalScheduleDaysHelp';
import ProfessionalScheduleWorkHoursHelp from '@components/ProfessionalScheduleWorkHoursHelp';
import ProfessionalScheduleIntervalsHelp from '@components/ProfessionalScheduleIntervalsHelp';

type FormLock = {
  id?: string;
  startTime: string;
  endTime: string;
  index?: number;
  resource?: string;
};

const ProfessionalSchedule = (): JSX.Element => {
  const navigate = useNavigate();
  const formMethods = useForm();
  const { user } = useAuth();
  const { reset, handleSubmit, control } = formMethods;
  const { getWeeklySchedule, updateWeeklySchedule, deleteLock } =
    useProfessionals();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentDay, setCurrentDay] = useState<WeeklySchedule>();
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule[]>([]);
  const [counter, setCounter] = useState<number>(-1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [intervals, setIntervals] = useState<FormLock[]>([]);
  const [lockDelete, setLockDelete] = useState<number>(-1);
  const [savingWeekly, setSavingWeekly] = useState<boolean>(false);
  const [changes, setChanges] = useState<boolean>(false);
  const [disableDay, setDisableDay] = useState<boolean>(false);
  const { startTime, endTime } = useWatch({
    control,
  });
  const [daysHelp, setDaysHelp] = useState<boolean>(false);
  const [workHoursHelp, setWorkHoursHelp] = useState<boolean>(false);
  const [intervalsHelp, setIntervalsHelp] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const { content } = await getWeeklySchedule();

        if (content && content.length > 0) {
          const initialDay = content[0] as WeeklySchedule;

          setCurrentDay(initialDay);
          setWeeklySchedule(content);
          if (initialDay.startTime) {
            countLockSlots(initialDay);
            setIntervals(initialDay.locks || []);
          } else {
            setIntervals([]);
            setDisableDay(true);
          }
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

  useEffect(() => {
    if (startTime && endTime) {
      countCurrentLockSlots(currentDay as WeeklySchedule);
    }
  }, [startTime, endTime]);

  const countCurrentLockSlots = (day: WeeklySchedule): void => {
    const totalTime = differenceInMinutes(endTime as Date, startTime as Date);

    let totalLockTime = 0;
    day?.locks?.forEach((lock) => {
      const lockStartTime = timeToDate(lock.startTime);
      const lockEndTime = timeToDate(lock.endTime);

      totalLockTime += differenceInMinutes(lockEndTime, lockStartTime);
    });

    const slotsWithoutLock = totalTime / (Number(user.baseDuration) as number);
    const lockSlots = totalLockTime / (Number(user.baseDuration) as number);

    const remainingSlots = slotsWithoutLock - lockSlots;

    setCounter(remainingSlots);
  };

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
    const oldIntervals = intervals.filter((item) => item.id);
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
      ...(!disableDay && { locks: newIntervals }),
      ...(disableDay && { disableDay }),
      dayOfTheWeek: Number(
        DaysOfTheWeek[currentDay?.dayOfTheWeek as DaysOfTheWeek]
      ) as number,
    };

    setSavingWeekly(true);
    try {
      const { content, message } = await updateWeeklySchedule(
        newWeeklySchedule
      );

      if (content && typeof content !== 'boolean') {
        const returnDay: WeeklySchedule = {
          ...content,
          locks:
            [
              ...(oldIntervals as WeeklyScheduleLock[]),
              ...(content.locks as WeeklyScheduleLock[]),
            ] || [],
        };
        setCurrentDay(returnDay);
        setWeeklySchedule((prev) => {
          const newWeekly = prev.map((item) =>
            item.dayOfTheWeek === currentDay?.dayOfTheWeek ? returnDay : item
          );

          return newWeekly;
        });
        setIntervals(
          [...oldIntervals, ...(content.locks as WeeklyScheduleLock[])] || []
        );
        countLockSlots(returnDay);
      }
      if (content && typeof content === 'boolean') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { startTime, endTime, id, ...treatedWeekly } = newWeeklySchedule;
        setCurrentDay({
          ...treatedWeekly,
          dayOfTheWeek: currentDay?.dayOfTheWeek,
        } as WeeklySchedule);
        setWeeklySchedule((prev) => {
          const newWeekly = prev.map((item) =>
            item.dayOfTheWeek === currentDay?.dayOfTheWeek
              ? { ...treatedWeekly, dayOfTheWeek: currentDay?.dayOfTheWeek }
              : item
          ) as WeeklySchedule[];

          return newWeekly;
        });
        setIntervals([]);
        setCounter(-1);
      }

      showToast({
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
      setChanges(false);
      setSavingWeekly(false);
    }
  };

  const handleDayChange = (day: WeeklySchedule): void => {
    if (changes) {
      showAlert({
        title: 'Deseja continuar?',
        text: 'É possível que existam campos alterados não salvos. Se continuar, as alterações serão perdidas!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: colors.PRIMARY,
        confirmButtonText: 'CONTINUAR',
        cancelButtonColor: colors.BACKGREY,
        cancelButtonText: '<span style="color: #000;"> CANCELAR</span>',
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          setCurrentDay(day);
          if (day.startTime && day.endTime) {
            setIntervals(day.locks || []);
            countLockSlots(day);
            reset({
              startTime: timeToDate(day.startTime),
              endTime: timeToDate(day.endTime),
            });
            setDisableDay(false);
          } else {
            setCounter(-1);
            setIntervals([]);
            reset({
              startTime: disabledDayDate(),
              endTime: disabledDayDate(),
            });
            setDisableDay(true);
          }
          setChanges(false);
        }
      });
      return;
    }
    setCurrentDay(day);
    if (day.startTime && day.endTime) {
      setIntervals(day.locks || []);
      countLockSlots(day);
      reset({
        startTime: timeToDate(day.startTime),
        endTime: timeToDate(day.endTime),
      });
      setDisableDay(false);
    } else {
      setIntervals([]);
      setCounter(-1);
      reset({
        startTime: disabledDayDate(),
        endTime: disabledDayDate(),
      });
      setDisableDay(true);
    }
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

              setCurrentDay((prev) => {
                return {
                  ...prev,
                  locks: newIntervals,
                } as WeeklySchedule;
              });

              setWeeklySchedule((prev) => {
                const newWeekly = prev.map((item) =>
                  item.dayOfTheWeek === currentDay?.dayOfTheWeek
                    ? { ...item, locks: newIntervals }
                    : item
                ) as WeeklySchedule[];

                return newWeekly;
              });
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

      setCurrentDay((prev) => {
        return {
          ...prev,
          locks: newIntervals,
        } as WeeklySchedule;
      });

      setWeeklySchedule((prev) => {
        const newWeekly = prev.map((item) =>
          item.dayOfTheWeek === currentDay?.dayOfTheWeek
            ? { ...item, locks: newIntervals }
            : item
        ) as WeeklySchedule[];

        return newWeekly;
      });

      return newIntervals;
    });
    setCounter((prev) => prev + 1);
  };

  const disabledDayDate = (): Date => {
    const date = new Date();

    date.setHours(0, 0, 0);

    return date;
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
        baseDuration={`${user.baseDuration}`}
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
              <AiOutlineRight
                size={30}
                style={{ color: '#707070', marginLeft: 10 }}
              />
              <Typography
                fontSize={'2rem'}
                style={{ marginLeft: 10, fontWeight: 400 }}
              >
                {user?.name?.split(' ')[0]}
              </Typography>
            </Header>

            {daysHelp && (
              <ProfessionalScheduleDaysHelp
                open={daysHelp}
                handleClose={() => setDaysHelp(false)}
              />
            )}
            <SectionDivider
              help={
                <Tooltip title="Ajuda">
                  <IconButton
                    style={{ marginLeft: 5 }}
                    onClick={() => setDaysHelp(true)}
                  >
                    <AiOutlineQuestionCircle
                      style={{ color: colors.PRIMARY }}
                    />
                  </IconButton>
                </Tooltip>
              }
            >
              Dias da semana
            </SectionDivider>

            <DayHoursAndLocks>
              <div
                style={{
                  display: 'flex',
                  marginTop: 30,
                  justifyContent: 'space-between',
                }}
              >
                {weeklySchedule.map((item) => (
                  <CardSelector
                    key={item.dayOfTheWeek}
                    name={`${item.dayOfTheWeek}`}
                    selected={currentDay?.dayOfTheWeek === item.dayOfTheWeek}
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
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '2rem 0 1rem 0',
                      }}
                    >
                      {workHoursHelp && (
                        <ProfessionalScheduleWorkHoursHelp
                          open={workHoursHelp}
                          handleClose={() => setWorkHoursHelp(false)}
                        />
                      )}
                      <TimesLabel style={{ padding: 0 }}>
                        Início e fim do expediente |{' '}
                        <span>Duração base das consultas: </span>
                        {user.baseDuration} <span>minutos.</span>
                      </TimesLabel>
                      <Tooltip title="Ajuda">
                        <IconButton
                          style={{ marginLeft: 5 }}
                          onClick={() => setWorkHoursHelp(true)}
                        >
                          <AiOutlineQuestionCircle
                            style={{ color: colors.PRIMARY }}
                          />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <WorkHoursContainer>
                      <div onFocus={() => setChanges(true)}>
                        <ControlledTimePicker
                          label="Início"
                          name="startTime"
                          defaultValue={
                            currentDay.startTime
                              ? timeToDate(currentDay.startTime)
                              : disabledDayDate()
                          }
                          disabled={disableDay}
                          rules={{
                            required: {
                              value: true,
                              message: 'O tempo de início é obrigatório',
                            },
                          }}
                        />
                      </div>
                      <div onFocus={() => setChanges(true)}>
                        <ControlledTimePicker
                          label="Fim"
                          name="endTime"
                          disabled={disableDay}
                          defaultValue={
                            currentDay.endTime
                              ? timeToDate(currentDay.endTime)
                              : disabledDayDate()
                          }
                          rules={{
                            required: {
                              value: true,
                              message: 'O tempo final é obrigatório',
                            },
                          }}
                        />
                      </div>
                      <FormControlLabel
                        style={{ maxWidth: 400 }}
                        control={
                          <StyledCheckbox
                            checked={disableDay}
                            onChange={() => {
                              setDisableDay((prev) => !prev);
                              setChanges(true);
                            }}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        }
                        label="Dia da semana sem expediente"
                      />
                    </WorkHoursContainer>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      {counter !== -1 && (
                        <>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '2rem 0 1rem 0',
                            }}
                          >
                            {intervalsHelp && (
                              <ProfessionalScheduleIntervalsHelp
                                open={intervalsHelp}
                                handleClose={() => setIntervalsHelp(false)}
                              />
                            )}
                            <TimesLabel style={{ padding: 0 }}>
                              {counter % 1 !== 0 || counter < 0
                                ? 'Sem intervalos - Os horários não batem com a duração base'
                                : `Intervalos - ${counter} restantes`}
                            </TimesLabel>
                            <Tooltip title="Ajuda">
                              <IconButton
                                style={{ marginLeft: 5 }}
                                onClick={() => setIntervalsHelp(true)}
                              >
                                <AiOutlineQuestionCircle
                                  style={{ color: colors.PRIMARY }}
                                />
                              </IconButton>
                            </Tooltip>
                          </div>

                          <IconButton
                            size="small"
                            style={{ width: 60, height: 60, marginLeft: 20 }}
                            onClick={() => {
                              setChanges(true);
                              setOpenModal(true);
                            }}
                            disabled={
                              loading ||
                              lockDelete !== -1 ||
                              savingWeekly ||
                              disableDay ||
                              counter < 0 ||
                              counter % 1 !== 0
                            }
                          >
                            <AiOutlinePlus
                              size={40}
                              style={{ color: colors.PRIMARY }}
                            />
                          </IconButton>
                        </>
                      )}
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
                            onClick={() => {
                              // setChanges(true);
                              removeInterval({ ...lock, index });
                            }}
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
            disabled={loading || lockDelete !== -1 || savingWeekly || !changes}
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
