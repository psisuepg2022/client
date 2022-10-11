import React from 'react';
import TextEditor from '@components/TextEditor';
import { Event } from 'react-big-calendar';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CustomBox,
  Container,
  Content,
  BoxHeader,
  Body,
  PatientName,
  AppointmentDate,
  CommentsTitle,
} from './styles';
import AlterTopToolbar from '@components/AlterTopToolbar';

import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { dateFormat } from '@utils/dateFormat';
import { IconButton } from '@mui/material';
import { idFromResource } from '@utils/schedule';
import { useSchedule } from '@contexts/Schedule';
import { showAlert } from '@utils/showAlert';
import { useComments } from '@contexts/Comments';

const CommentCreation = (): JSX.Element => {
  const { state }: { state: Event } = useLocation() as { state: Event };
  const navigate = useNavigate();
  const { setEvents } = useSchedule();
  const { create } = useComments();

  const concludeAndSaveComment = async (text: string) => {
    try {
      const appointmentId = idFromResource(state.resource);

      const { content, message } = await create(appointmentId, text);

      if (!content) {
        showAlert({
          icon: 'error',
          text: 'Ocorreu um problema ao atualizar a consulta',
        });
      }

      setEvents((prev) => {
        const newEvents: Event[] = prev.map((event) =>
          idFromResource(event.resource) === content?.appointmentId
            ? {
                ...event,
                resource: `${content?.status}/${content?.appointmentId}/${content?.updatedAt}`,
              }
            : event
        );

        return newEvents;
      });

      showAlert({
        title: 'Sucesso!',
        icon: 'success',
        text: message,
        allowOutsideClick: false,
        confirmButtonText: 'RERTORNAR À AGENDA',
      }).then(async (result) => {
        if (result.isConfirmed) {
          navigate('/schedule');
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        icon: 'error',
        text:
          e?.response?.data?.message ||
          'Ocorreu um problema ao concluir a consulta',
      });
    }
  };

  return (
    <Container>
      <AlterTopToolbar />
      <Content>
        <CustomBox>
          <BoxHeader>
            <IconButton onClick={() => navigate('/schedule')}>
              <AiOutlineLeft size={40} />
            </IconButton>
            <CommentsTitle>Criar Anotação</CommentsTitle>
            <AiOutlineRight size={25} style={{ color: '#707070' }} />
            <PatientName>{state.title} | </PatientName>
            <AppointmentDate>
              {dateFormat({
                date: state.start as Date,
                // eslint-disable-next-line quotes
                stringFormat: "d 'de' MMMM 'de' yyyy",
              })}{' '}
              <AiOutlineRight size={20} style={{ color: '#707070' }} />{' '}
              {dateFormat({
                date: state.start as Date,
                stringFormat: 'HH:mm',
              })}
              {' - '}
              {dateFormat({
                date: state.end as Date,
                stringFormat: 'HH:mm',
              })}
            </AppointmentDate>
          </BoxHeader>
          <Body>
            <TextEditor saveComment={concludeAndSaveComment} />
          </Body>
        </CustomBox>
      </Content>
    </Container>
  );
};

export default CommentCreation;
