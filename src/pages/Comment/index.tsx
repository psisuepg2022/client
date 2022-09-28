import React, { useEffect, useState } from 'react';
import AlterTopToolbar from '@components/AlterTopToolbar';
import { Event } from 'react-big-calendar';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppointmentDate,
  BoxHeader,
  CommentsTitle,
  Container,
  Content,
  CustomBox,
  PatientName,
  Body,
  LogoContainer,
} from './style';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { dateFormat } from '@utils/dateFormat';
import { IconButton } from '@mui/material';
import { useSchedule } from '@contexts/Schedule';
import { showAlert } from '@utils/showAlert';
import CircularProgressWithContent from '@components/CircularProgressWithContent';
import logoPSIS from '@assets/PSIS-Logo-Invertido-Transparente.png';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { useAuth } from '@contexts/Auth';
import { addMinutes } from 'date-fns';

const Comment = (): JSX.Element => {
  const { state }: { state: Event } = useLocation() as { state: Event };
  const {
    user: { baseDuration },
  } = useAuth();
  const navigate = useNavigate();
  const { getById } = useSchedule();
  const [loading, setLoading] = useState<boolean>(true);
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const appointmentId = state.resource;
        const { content } = await getById(appointmentId);

        if (!content?.comments) {
          showAlert({
            title: '',
            icon: 'info',
            text: 'A consulta não possui anotações. Clique em OK para retornar à agenda',
            allowOutsideClick: false,
          }).then(async (result) => {
            if (result.isConfirmed) {
              navigate('/schedule');
            }
          });

          return;
        }

        const purifiedComment = DOMPurify.sanitize(content.comments);

        setComment(`${parse(purifiedComment)}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        showAlert({
          icon: 'error',
          text:
            e?.response?.data?.message ||
            'Ocorreu um problema ao recuperar as anotações para essa consulta',
          allowOutsideClick: false,
        }).then(async (result) => {
          if (result.isConfirmed) {
            navigate('/schedule');
          }
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [state.resource]);

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

  const isoToDate = (iso: string): Date => {
    const hour = iso.split('T')[1].substring(0, 2);
    const minute = iso.split('T')[1].substring(3, 5);

    const date = new Date(iso);
    date.setHours(Number(hour));
    date.setMinutes(Number(minute));
    date.setSeconds(0);
    return date;
  };

  return (
    <Container>
      <AlterTopToolbar />
      <Content>
        <CustomBox>
          <BoxHeader>
            <IconButton onClick={() => navigate(-1)}>
              <AiOutlineLeft size={40} />
            </IconButton>
            <CommentsTitle>Anotações</CommentsTitle>
            <AiOutlineRight size={25} style={{ color: '#707070' }} />
            <PatientName>{state.title} | </PatientName>
            <AppointmentDate>
              {dateFormat({
                date: isoToDate(`${state.start}`) as Date,
                // eslint-disable-next-line quotes
                stringFormat: "d 'de' MMMM 'de' yyyy",
              })}{' '}
              <AiOutlineRight size={20} style={{ color: '#707070' }} />{' '}
              {dateFormat({
                date: isoToDate(`${state.start}`) as Date,
                stringFormat: 'HH:mm',
              })}
              {/* {' - '}
              {dateFormat({
                date: isoToDate(`${state.start}`, true) as Date,
                stringFormat: 'HH:mm',
              })} */}
            </AppointmentDate>
          </BoxHeader>
          <Body dangerouslySetInnerHTML={{ __html: comment }}></Body>
        </CustomBox>
      </Content>
    </Container>
  );
};

export default Comment;
