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
  TimesLabel,
  WorkHoursContainer,
} from './styles';
import { FiChevronLeft } from 'react-icons/fi';
import { AiOutlinePlus } from 'react-icons/ai';
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

const ProfessionalSchedule = (): JSX.Element => {
  const navigate = useNavigate();
  const formMethods = useForm();
  const { reset, handleSubmit } = formMethods;
  const { getWeeklySchedule } = useProfessionals();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentDay, setCurrentDay] = useState<WeeklySchedule>();
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { content } = await getWeeklySchedule();

        if (content && content.length > 0) {
          setWeeklySchedule(content);
          setCurrentDay(content[0]);
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
    console.log('data', data);
  };

  const timeToDate = (time: string): Date => {
    const [hour, minute] = time.split(':');
    const currentDate = new Date();
    currentDate.setHours(Number(hour), Number(minute), 0);

    return currentDate;
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
                  onSelect={() => {
                    setCurrentDay(item);
                    reset({
                      startTime: timeToDate(item.startTime),
                      endTime: timeToDate(item.endTime),
                    });
                  }}
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
                <form onSubmit={handleSubmit(onSubmit)}>
                  <TimesLabel>Início e fim do expediente</TimesLabel>
                  <WorkHoursContainer>
                    <ControlledTimePicker
                      label="Início"
                      name="startTime"
                      required
                      defaultValue={timeToDate(currentDay.startTime)}
                    />
                    <ControlledTimePicker
                      label="Fim"
                      name="endTime"
                      required
                      defaultValue={timeToDate(currentDay.endTime)}
                    />
                  </WorkHoursContainer>

                  <TimesLabel>Intervalos</TimesLabel>
                  {currentDay &&
                    currentDay.locks &&
                    currentDay.locks.length > 0 &&
                    currentDay.locks.map((lock) => (
                      <IntervalsContainer key={lock.id}>
                        <ControlledTimePicker
                          label="Início"
                          name="lock.startTime"
                          required
                          defaultValue={timeToDate(lock.startTime)}
                        />
                        <ControlledTimePicker
                          label="Fim"
                          name="lock.endTime"
                          required
                          defaultValue={timeToDate(lock.endTime)}
                        />
                        <IconButton
                          style={{ width: 60, height: 60, marginLeft: 20 }}
                        >
                          <AiOutlinePlus
                            size={60}
                            style={{ color: colors.PRIMARY }}
                          />
                        </IconButton>
                      </IntervalsContainer>
                    ))}
                </form>
              </FormProvider>
            )}
          </DayHoursAndLocks>
        </Content>
      </Box>
    </Container>
  );
};

export default ProfessionalSchedule;
