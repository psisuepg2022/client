import React, { useEffect, useState } from 'react';
import { IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Content, Header, LogoContainer } from './styles';
import { FiChevronLeft } from 'react-icons/fi';
import { colors } from '@global/colors';
import { showAlert } from '@utils/showAlert';
import { useProfessionals } from '@contexts/Professionals';
import CircularProgressWithContent from '@components/CircularProgressWithContent';
import logoPSIS from '@assets/PSIS-Logo-Invertido-Transparente.png';
import { WeeklySchedule } from '@models/WeeklySchedule';
import CardSelector from '@components/CardSelector';
import SectionDivider from '@components/SectionDivider';

const ProfessionalSchedule = (): JSX.Element => {
  const navigate = useNavigate();
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

          <div style={{ display: 'flex', marginTop: 30 }}>
            {weeklySchedule.map((item) => (
              <CardSelector
                key={item.id}
                name={`${item.dayOfTheWeek}`}
                selected={currentDay?.id === item.id}
                onSelect={() => setCurrentDay(item)}
                style={{ padding: '0.3rem' }}
                textStyle={{
                  color: colors.TEXT,
                  fontWeight: '600',
                  textTransform: 'none',
                }}
              />
            ))}
          </div>
        </Content>
      </Box>
    </Container>
  );
};

export default ProfessionalSchedule;
