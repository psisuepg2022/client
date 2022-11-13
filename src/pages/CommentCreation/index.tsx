import React, { useState } from 'react';
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
  LogoContainer,
} from './styles';
import AlterTopToolbar from '@components/AlterTopToolbar';

import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { dateFormat } from '@utils/dateFormat';
import { IconButton, Modal } from '@mui/material';
import { idFromResource } from '@utils/schedule';
import { useSchedule } from '@contexts/Schedule';
import { showAlert } from '@utils/showAlert';
import { useComments } from '@contexts/Comments';
import { colors } from '@global/colors';
import { AppointmentSaveByProfessional } from '@interfaces/AppointmentSaveByProfessional';
import CircularProgressWithContent from '@components/CircularProgressWithContent';
import logoPSIS from '@assets/PSIS-Logo-Invertido-Transparente.png';
import { showToast } from '@utils/showToast';

const CommentCreation = (): JSX.Element => {
  const { state }: { state: Event } = useLocation() as { state: Event };
  const navigate = useNavigate();
  const { setEvents, saveAppointmentByProfessional } = useSchedule();
  const { create } = useComments();
  const [loading, setLoading] = useState<boolean>(false);

  const concludeAndSaveComment = async (text: string) => {
    try {
      const appointmentId = idFromResource(state.resource);

      const { content, message } = await create(appointmentId, text);

      if (!content) {
        showAlert({
          icon: 'error',
          text: 'Ocorreu um problema ao atualizar a consulta',
        });
      } else {
        showToast({
          text: 'Operação realizada com sucesso!',
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

      if (content?.hasSameTimeToNextWeek) {
        const nextWeekDate = `${content.hasSameTimeToNextWeek.date} | ${content.hasSameTimeToNextWeek.startTime} às ${content.hasSameTimeToNextWeek.endTime}`;

        showAlert({
          title: 'Sucesso!',
          icon: 'success',
          text: `${message} O mesmo dia e horário estão disponíveis para semana que vem: ${nextWeekDate}. Deseja fazer o agendamento?`,
          allowOutsideClick: false,
          showCancelButton: true,
          cancelButtonColor: colors.BACKGREY,
          cancelButtonText:
            '<span style="color: #000;"> NÃO, RETORNAR À AGENDA</span>',
          confirmButtonText: 'REALIZAR REAGENDAMENTO',
        }).then(async (result) => {
          if (result.isConfirmed) {
            const formDate = content?.hasSameTimeToNextWeek?.date
              .split('/')
              .reverse()
              .join('-');

            try {
              setLoading(true);
              await saveAppointmentByProfessional({
                ...(content.hasSameTimeToNextWeek as AppointmentSaveByProfessional),
                date: formDate as string,
              });

              showAlert({
                title: 'Sucesso!',
                icon: 'success',
                text: `${message} Após o redirecionamento esta anotação poderá ser exportada para um arquivo PDF.`,
                allowOutsideClick: false,
                confirmButtonText: 'RETORNAR À AGENDA',
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
                  'Ocorreu um problema no reagendamento',
              });
            } finally {
              setLoading(false);
            }

            return;
          }
          if (result.isDismissed) {
            showAlert({
              title: 'Sucesso!',
              icon: 'success',
              text: 'Após o redirecionamento esta anotação poderá ser exportada para um arquivo PDF.',
              allowOutsideClick: false,
              confirmButtonText: 'RETORNAR À AGENDA',
            }).then(async (result) => {
              if (result.isConfirmed) {
                navigate('/schedule');
              }
            });
            return;
          }
        });
        return;
      }

      showAlert({
        title: 'Sucesso!',
        icon: 'success',
        text: `${message} Após o redirecionamento esta anotação poderá ser exportada para um arquivo PDF.`,
        allowOutsideClick: false,
        confirmButtonText: 'RETORNAR À AGENDA',
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
      <Modal
        open={loading}
        sx={{
          display: 'flex',
          height: '100%',
          minWidth: '100vw',
          justifyContent: 'center',
          alignItems: 'center ',
        }}
      >
        <>
          <CircularProgressWithContent
            content={<LogoContainer src={logoPSIS} />}
            size={200}
          />
        </>
      </Modal>
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
