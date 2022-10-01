import React, { useState } from 'react';
import ControlledInput from '@components/ControlledInput';
import SectionDivider from '@components/SectionDivider';
import { useAuth } from '@contexts/Auth';
import { colors } from '@global/colors';
import {
  CircularProgress,
  FormControlLabel,
  IconButton,
  Typography,
} from '@mui/material';
import { showAlert } from '@utils/showAlert';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { FiChevronLeft } from 'react-icons/fi';
import {
  BaseDurationSection,
  Body,
  Box,
  Container,
  Content,
  DayHoursAndLocks,
  Form,
  Header,
  IntervalRow,
  IntervalsContainer,
  PasswordSection,
  StyledButton,
  StyledCheckbox,
  TimesLabel,
  WorkHoursContainer,
} from './styles';
import ControlledTimePicker from '@components/ControlledTimePicker';
import CardSelector from '@components/CardSelector';
import { CreateWeeklySchedule } from '@models/WeeklySchedule';
import { timeToDate } from '@utils/timeToDate';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import {
  ConfigFormProps,
  FormLock,
  createInitialWeeklySchedule,
  disabledDayDate,
} from './utils';
import CreateScheduleLockModal from '@components/CreateScheduleLockModal';
import { differenceInMinutes } from 'date-fns';
import { dateFormat } from '@utils/dateFormat';

const initialWeeklySchedule = createInitialWeeklySchedule();

const ProfessionalInitialConfig = (): JSX.Element => {
  const { signOut } = useAuth();
  const formMethods = useForm({
    defaultValues: {
      startTime: disabledDayDate(),
      endTime: disabledDayDate(),
      baseDuration: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });
  const { handleSubmit, reset, control } = formMethods;
  const randomKey = Math.random();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentDay, setCurrentDay] = useState<CreateWeeklySchedule>(
    initialWeeklySchedule[0]
  );
  const [weeklySchedule, setWeeklySchedule] = useState<CreateWeeklySchedule[]>(
    initialWeeklySchedule
  );
  const [counter, setCounter] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [intervals, setIntervals] = useState<FormLock[]>([]);
  const [lockDelete, setLockDelete] = useState<number>(-1);
  const [savingWeekly, setSavingWeekly] = useState<boolean>(false);
  const [changes, setChanges] = useState<boolean>(false);

  const { baseDuration, startTime, endTime } = useWatch({ control });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any): Promise<void> => {
    const formData: ConfigFormProps = { ...data } as ConfigFormProps;
    console.log('data', formData);
  };

  const signOutConfirm = (): void => {
    showAlert({
      title: 'Atenção!',
      text: 'Deseja realmente sair? Todo o progresso será perdido!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: colors.PRIMARY,
      confirmButtonText: 'CONTINUAR',
      cancelButtonColor: colors.BACKGREY,
      cancelButtonText: '<span style="color: #000;"> CANCELAR</span>',
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        signOut();
      }
    });
  };

  const countLockSlots = (day: CreateWeeklySchedule): void => {
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

    const slotsWithoutLock = totalTime / (Number(baseDuration) as number);
    const lockSlots = totalLockTime / (Number(baseDuration) as number);

    const remainingSlots = slotsWithoutLock - lockSlots;

    setCounter(remainingSlots);
  };

  console.log('WEEKLY SCHEDULES', weeklySchedule, currentDay);

  const removeInterval = async (interval: FormLock): Promise<void> => {
    setIntervals((prev) => {
      const newIntervals = [...prev];
      newIntervals.splice(interval.index as number, 1);

      setCurrentDay((prev) => {
        return {
          ...prev,
          locks: newIntervals,
        } as CreateWeeklySchedule;
      });

      setWeeklySchedule((prev) => {
        const newWeekly = prev.map((item) =>
          item.dayOfTheWeek === currentDay?.dayOfTheWeek
            ? { ...item, locks: newIntervals }
            : item
        ) as CreateWeeklySchedule[];

        return newWeekly;
      });

      return newIntervals;
    });
    setCounter((prev) => prev + 1);
  };

  const handleDayChange = (day: CreateWeeklySchedule): void => {
    const start = dateFormat({
      date: startTime as Date,
      stringFormat: 'HH:mm',
    });
    const end = dateFormat({
      date: endTime as Date,
      stringFormat: 'HH:mm',
    });
    setIntervals(day.locks || []);
    setCurrentDay((prevDay) => {
      setWeeklySchedule((prevWeekly) => {
        const newWeekly = [...prevWeekly].map((item) => {
          if (item.dayOfTheWeek === prevDay.dayOfTheWeek) {
            if (start !== '00:00' || end !== '00:00') {
              return {
                ...item,
                startTime: start,
                endTime: end,
                disableDay: false,
                altered: true,
              };
            }
            console.log('start', startTime, endTime);
            return item;
          }
          return item;
        });

        return newWeekly;
      });
      return day;
    });

    // if ((start === '00:00' || end === '00:00') && !day.altered) {
    //   reset({
    //     startTime: disabledDayDate(),
    //     endTime: disabledDayDate(),
    //   });
    //   setDisableDay(false);
    //   // true === dia desabilitado
    //   return;
    // }
    // console.log('DISABLE', start, end);
    // setDisableDay(true);
    reset({
      startTime: timeToDate(day.startTime),
      endTime: timeToDate(day.endTime),
    });
  };

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
            <IconButton onClick={signOutConfirm}>
              <FiChevronLeft
                style={{ color: colors.TEXT, fontSize: '2.5rem' }}
              />
            </IconButton>
            <Typography fontSize={'2.5rem'}>
              Configuração Inicial do Profissional
            </Typography>
          </Header>
          <Body>
            <FormProvider {...formMethods}>
              <Form
                id={`${randomKey}-password`}
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
                noValidate
              >
                <SectionDivider>Nova senha</SectionDivider>
                <PasswordSection>
                  <ControlledInput
                    rules={{
                      required: {
                        value: true,
                        message: 'A nova senha é obrigatória',
                      },
                    }}
                    type="password"
                    endFunction="password"
                    name="newPassword"
                    label="Nova senha"
                    autoComplete="new-password"
                  />
                  <ControlledInput
                    rules={{
                      required: {
                        value: true,
                        message: 'A confirmação da senha é obrigatória',
                      },
                    }}
                    type="password"
                    endFunction="password"
                    name="confirmNewPassword"
                    label="Confirme a senha"
                    autoComplete="new-password"
                  />
                </PasswordSection>

                <SectionDivider>Duração das consultas</SectionDivider>
                <BaseDurationSection>
                  <ControlledInput
                    name="baseDuration"
                    label="Duração (em minutos)"
                    type="number"
                    autoComplete="off"
                    rules={{
                      required: {
                        value: true,
                        message: 'A duração base das consultas é obrigatória',
                      },
                    }}
                  />
                </BaseDurationSection>

                <SectionDivider>Horários da agenda</SectionDivider>
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
                        selected={
                          currentDay?.dayOfTheWeek === item.dayOfTheWeek
                        }
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
                    <>
                      <TimesLabel>Início e fim do expediente</TimesLabel>
                      <WorkHoursContainer>
                        <div onBlur={() => setChanges(true)}>
                          <ControlledTimePicker
                            label="Início"
                            name="startTime"
                            defaultValue={
                              currentDay.startTime
                                ? timeToDate(currentDay.startTime)
                                : disabledDayDate()
                            }
                            disabled={currentDay.disableDay}
                            rules={{
                              required: {
                                value: true,
                                message: 'O tempo de início é obrigatório',
                              },
                            }}
                          />
                        </div>
                        <div onBlur={() => setChanges(true)}>
                          <ControlledTimePicker
                            label="Fim"
                            name="endTime"
                            disabled={currentDay.disableDay}
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
                              checked={currentDay.disableDay}
                              onChange={() => {
                                // setDisableDay((prev) => !prev);
                                setCurrentDay((prev) => ({
                                  ...prev,
                                  disableDay: !currentDay.disableDay,
                                }));
                                setWeeklySchedule((prevWeekly) => {
                                  const newWeekly = [...prevWeekly].map(
                                    (item) =>
                                      item.dayOfTheWeek ===
                                      currentDay.dayOfTheWeek
                                        ? {
                                            ...item,
                                            disableDay: !currentDay.disableDay,
                                          }
                                        : item
                                  );

                                  return newWeekly;
                                });
                                setChanges(true);
                              }}
                              inputProps={{ 'aria-label': 'controlled' }}
                            />
                          }
                          label="Dia da semana sem expediente"
                        />
                      </WorkHoursContainer>

                      {!currentDay.disableDay && (
                        <>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <>
                              <TimesLabel>
                                Intervalos - {counter} restantes
                              </TimesLabel>

                              <IconButton
                                size="small"
                                style={{
                                  width: 60,
                                  height: 60,
                                  marginLeft: 20,
                                }}
                                onClick={() => {
                                  setChanges(true);
                                  setOpenModal(true);
                                }}
                                disabled={
                                  loading ||
                                  lockDelete !== -1 ||
                                  savingWeekly ||
                                  currentDay.disableDay
                                }
                              >
                                <AiOutlinePlus
                                  size={40}
                                  style={{ color: colors.PRIMARY }}
                                />
                              </IconButton>
                            </>
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
                                  style={{
                                    width: 60,
                                    height: 60,
                                    marginLeft: 20,
                                  }}
                                  onClick={() => {
                                    setChanges(true);
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
                        </>
                      )}
                    </>
                  )}
                </DayHoursAndLocks>

                <StyledButton type="submit" disabled={loading}>
                  {loading ? (
                    <CircularProgress size={20} style={{ color: '#FFF' }} />
                  ) : (
                    'SALVAR'
                  )}
                </StyledButton>
              </Form>
            </FormProvider>
          </Body>
        </Content>
      </Box>
    </Container>
  );
};

export default ProfessionalInitialConfig;
