import React, { useEffect, useState } from 'react';
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
  BaseDurationDisclaimer,
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
import {
  AiOutlinePlus,
  AiOutlineQuestionCircle,
  AiOutlineRight,
} from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import {
  ConfigFormProps,
  FormLock,
  createInitialWeeklySchedule,
  disabledDayDate,
} from './utils';
import CreateScheduleLockModal from '@components/CreateScheduleLockModal';
import { differenceInMinutes, isAfter, isEqual } from 'date-fns';
import { dateFormat } from '@utils/dateFormat';
import { ConfigureProfessional } from '@models/Professional';
import { useNavigate } from 'react-router-dom';
import { useProfessionals } from '@contexts/Professionals';
import { DaysOfTheWeek } from '@interfaces/DaysOfTheWeek';
import { api } from '@service/index';
import ProfessionalScheduleDaysHelp from '@components/ProfessionalScheduleDaysHelp';
import ProfessionalScheduleWorkHoursHelp from '@components/ProfessionalScheduleWorkHoursHelp';
import ProfessionalScheduleIntervalsHelp from '@components/ProfessionalScheduleIntervalsHelp';
import ProfessionalConfigPasswordHelp from '@components/ProfessionalConfigPasswordHelp';
import ProfessionalConfigBaseDurationHelp from '@components/ProfessionalConfigBaseDurationHelp';

const initialWeeklySchedule = createInitialWeeklySchedule();

const ProfessionalInitialConfig = (): JSX.Element => {
  const {
    signOut,
    setUser,
    user: { name },
  } = useAuth();
  const { configure } = useProfessionals();
  const formMethods = useForm({
    defaultValues: {
      startTime: disabledDayDate(),
      endTime: disabledDayDate(),
      baseDuration: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });
  const navigate = useNavigate();
  const { handleSubmit, reset, control, setError } = formMethods;
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

  const { baseDuration, startTime, endTime, ...formValues } = useWatch({
    control,
  });
  const [daysHelp, setDaysHelp] = useState<boolean>(false);
  const [workHoursHelp, setWorkHoursHelp] = useState<boolean>(false);
  const [intervalsHelp, setIntervalsHelp] = useState<boolean>(false);
  const [passwordHelp, setPasswordHelp] = useState<boolean>(false);
  const [baseDurationHelp, setBaseDurationHelp] = useState<boolean>(false);

  useEffect(() => {
    if (!baseDuration) {
      const newWeekly = createInitialWeeklySchedule();
      setCurrentDay(newWeekly[0]);
      setWeeklySchedule(newWeekly);
      setIntervals([]);
      reset({
        ...formValues,
      });
      return;
    }
    if (startTime && endTime && baseDuration) {
      countCurrentLockSlots(currentDay);
    }
  }, [startTime, endTime, baseDuration]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any): Promise<void> => {
    const formData: ConfigFormProps = { ...data } as ConfigFormProps;

    const emptyDay = weeklySchedule.find(
      (item) => item.altered === false && !item.disableDay
    );
    if (emptyDay !== undefined) {
      showAlert({
        title: 'Atenção!',
        text: `Insira um horário para ${emptyDay.dayOfTheWeek}. Se o dia não tiver expediente, marque a caixa de seleção.`,
        icon: 'warning',
      });
      return;
    }

    const weeklyMapped = weeklySchedule.map((item) => {
      const dayOfTheWeek: DaysOfTheWeek =
        item.dayOfTheWeek as unknown as DaysOfTheWeek;

      return {
        ...item,
        dayOfTheWeek: Number(
          DaysOfTheWeek[dayOfTheWeek as DaysOfTheWeek]
        ) as number,
      };
    });

    const configs: ConfigureProfessional = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmNewPassword: formData.confirmNewPassword,
      baseDuration: `${formData.baseDuration}`,
      weeklySchedule: [...weeklyMapped],
    };

    try {
      setLoading(true);

      const { accessToken, user, refreshToken } = await configure(configs);

      showAlert({
        title: 'Sucesso!',
        text: 'O profissional foi configurado com sucesso! Ao clicar no botão OK você será redirecionado para a página inicial.',
        icon: 'success',
        confirmButtonColor: colors.PRIMARY,
        confirmButtonText: 'OK',
        reverseButtons: true,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          localStorage.setItem('@psis:accessToken', accessToken || '');
          localStorage.setItem('@psis:refreshToken', refreshToken || '');
          localStorage.setItem('@psis:userData', JSON.stringify(user));
          api.defaults.headers.common[
            'authorization'
          ] = `Bearer ${accessToken}`;

          setUser(user);
          navigate('/schedule', { replace: true });
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        icon: 'error',
        text:
          e?.response?.data?.message ||
          'Ocorreu um problema ao configurar o profissional',
      });
    } finally {
      setLoading(false);
    }
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

  const countCurrentLockSlots = (day: CreateWeeklySchedule): void => {
    const totalTime = differenceInMinutes(endTime as Date, startTime as Date);

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

    if (
      differenceInMinutes(endTime as Date, startTime as Date) %
      Number(baseDuration)
    ) {
      setError('endTime', {
        message: `O intervalo entre os horários deve corresponder à duração base: ${baseDuration} minutos`,
      });
      setError('startTime', {
        message: `O intervalo entre os horários deve corresponder à duração base: ${baseDuration} minutos`,
      });
      return;
    }

    if (
      (isAfter(startTime as Date, endTime as Date) ||
        isEqual(startTime as Date, endTime as Date)) &&
      !currentDay.disableDay
    ) {
      setError('endTime', {
        message: 'O horário final deve ser maior que o inicial',
      });
      return;
    }
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
            return item;
          }
          return item;
        });

        return newWeekly;
      });
      return day;
    });

    reset({
      ...formValues,
      baseDuration,
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
          setCurrentDay((prevDay) => {
            setWeeklySchedule((prevWeekly) => {
              const newWeekly = [...prevWeekly].map((item) =>
                item.dayOfTheWeek === prevDay.dayOfTheWeek
                  ? { ...item, locks: [...(item.locks || []), lock] }
                  : item
              );

              return newWeekly;
            });
            return {
              ...prevDay,
              locks: [...(prevDay.locks || []), lock],
            };
          });
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
        baseDuration={`${baseDuration}`}
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
            <AiOutlineRight
              size={30}
              style={{ color: '#707070', marginLeft: 10 }}
            />
            <Typography
              fontSize={'2rem'}
              style={{ marginLeft: 10, fontWeight: 400 }}
            >
              {name?.split(' ')[0]}
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
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  {passwordHelp && (
                    <ProfessionalConfigPasswordHelp
                      open={passwordHelp}
                      handleClose={() => setPasswordHelp(false)}
                    />
                  )}
                  <SectionDivider
                    help={
                      <IconButton
                        style={{ marginLeft: 5 }}
                        onClick={() => setPasswordHelp(true)}
                      >
                        <AiOutlineQuestionCircle
                          style={{ color: colors.PRIMARY }}
                        />
                      </IconButton>
                    }
                  >
                    Nova senha
                  </SectionDivider>
                  <PasswordSection>
                    <ControlledInput
                      rules={{
                        required: {
                          value: true,
                          message: 'A senha atual é obrigatória',
                        },
                      }}
                      type="password"
                      endFunction="password"
                      name="oldPassword"
                      label="Senha atual"
                      autoComplete="new-password"
                    />
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

                  {baseDurationHelp && (
                    <ProfessionalConfigBaseDurationHelp
                      open={baseDurationHelp}
                      handleClose={() => setBaseDurationHelp(false)}
                    />
                  )}
                  <SectionDivider
                    help={
                      <IconButton
                        style={{ marginLeft: 5 }}
                        onClick={() => setBaseDurationHelp(true)}
                      >
                        <AiOutlineQuestionCircle
                          style={{ color: colors.PRIMARY }}
                        />
                      </IconButton>
                    }
                  >
                    Duração base
                  </SectionDivider>
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
                    <BaseDurationDisclaimer>
                      Atenção! A duração base escolhida não poderá ser alterada
                      posteriormente pelo usuário
                    </BaseDurationDisclaimer>
                  </BaseDurationSection>

                  {baseDuration && (
                    <>
                      {daysHelp && (
                        <ProfessionalScheduleDaysHelp
                          open={daysHelp}
                          handleClose={() => setDaysHelp(false)}
                          config
                        />
                      )}
                      <SectionDivider
                        help={
                          <IconButton
                            style={{ marginLeft: 5 }}
                            onClick={() => setDaysHelp(true)}
                          >
                            <AiOutlineQuestionCircle
                              style={{ color: colors.PRIMARY }}
                            />
                          </IconButton>
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
                              selected={
                                currentDay?.dayOfTheWeek === item.dayOfTheWeek
                              }
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
                          <>
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
                                {baseDuration} <span>minutos.</span>
                              </TimesLabel>
                              <IconButton
                                style={{ marginLeft: 5 }}
                                onClick={() => setWorkHoursHelp(true)}
                              >
                                <AiOutlineQuestionCircle
                                  style={{ color: colors.PRIMARY }}
                                />
                              </IconButton>
                            </div>
                            <WorkHoursContainer>
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
                                  validate: (date) =>
                                    currentDay.disableDay
                                      ? undefined
                                      : !isEqual(endTime as Date, date) ||
                                        'Horário inválido',
                                }}
                              />
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
                                  validate: (date) =>
                                    currentDay.disableDay
                                      ? undefined
                                      : !isEqual(startTime as Date, date) ||
                                        'Horário inválido',
                                }}
                              />
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
                                        altered: true,
                                      }));
                                      setWeeklySchedule((prevWeekly) => {
                                        const newWeekly = [...prevWeekly].map(
                                          (item) =>
                                            item.dayOfTheWeek ===
                                            currentDay.dayOfTheWeek
                                              ? {
                                                  ...item,
                                                  disableDay:
                                                    !currentDay.disableDay,
                                                  altered: true,
                                                }
                                              : item
                                        );

                                        return newWeekly;
                                      });
                                      setError('endTime', {
                                        message: '',
                                      });
                                      setError('startTime', {
                                        message: '',
                                      });
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
                                          handleClose={() =>
                                            setIntervalsHelp(false)
                                          }
                                        />
                                      )}
                                      <TimesLabel style={{ padding: 0 }}>
                                        {counter - Math.floor(counter) === 0
                                          ? `Intervalos - ${counter} restantes`
                                          : 'Não é possível cadastrar intervalos com os atuais início e fim de expediente'}
                                      </TimesLabel>
                                      <IconButton
                                        style={{ marginLeft: 5 }}
                                        onClick={() => setIntervalsHelp(true)}
                                      >
                                        <AiOutlineQuestionCircle
                                          style={{ color: colors.PRIMARY }}
                                        />
                                      </IconButton>
                                    </div>

                                    <IconButton
                                      size="small"
                                      style={{
                                        width: 60,
                                        height: 60,
                                        marginLeft: 20,
                                      }}
                                      onClick={() => {
                                        setOpenModal(true);
                                      }}
                                      disabled={
                                        loading ||
                                        currentDay.disableDay ||
                                        counter - Math.floor(counter) !== 0 ||
                                        counter === 0
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
                                        disabled={loading}
                                        style={{
                                          width: 60,
                                          height: 60,
                                          marginLeft: 20,
                                        }}
                                        onClick={() => {
                                          removeInterval({ ...lock, index });
                                        }}
                                      >
                                        <MdDelete
                                          size={40}
                                          style={{ color: colors.PRIMARY }}
                                        />
                                      </IconButton>
                                    </IntervalsContainer>
                                  ))}
                              </>
                            )}
                          </>
                        )}
                      </DayHoursAndLocks>
                    </>
                  )}
                </div>

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
