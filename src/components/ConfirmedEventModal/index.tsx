import React, { useState } from 'react';
import {
  AdditionalInfos,
  Body,
  ButtonsContainer,
  EventPrimaryText,
  Header,
  ScheduleAtDate,
  ScheduleAtText,
  ScheduledAtContainer,
  StatusText,
  StyledBox,
  StyledCancelButton,
  StyledConfirmButton,
  StyledModal,
} from './styles';
import { MdOutlineClose, MdOutlineStickyNote2 } from 'react-icons/md';
import { AiFillSchedule } from 'react-icons/ai';
import { colors } from '@global/colors';
import { CircularProgress, IconButton } from '@mui/material';
import { Event } from 'react-big-calendar';
import { useSchedule } from '@contexts/Schedule';
import {
  idFromResource,
  statusFromResource,
  updatedAtFromResource,
} from '@utils/schedule';
import { showAlert } from '@utils/showAlert';
import { dateFormat } from '@utils/dateFormat';
import { isAfter } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/Auth';

type ConfirmedEventModalProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
  eventInfo: Event | undefined;
};

const ConfirmedEventModal = ({
  open,
  handleClose,
  eventInfo,
}: ConfirmedEventModalProps): JSX.Element => {
  const { updateAppointmentStatus, setEvents } = useSchedule();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    user: { permissions },
  } = useAuth();

  if (!eventInfo) return <></>;

  if (eventInfo && !eventInfo.title) return <></>;

  const closeAll = (reason: 'backdropClick' | 'escapeKeyDown' | ''): void => {
    handleClose(reason);
  };

  const updateStatus = async (status: string) => {
    try {
      setLoading(true);
      const appointmentId = idFromResource(eventInfo.resource);
      const { content, message } = await updateAppointmentStatus(
        appointmentId,
        status
      );

      if (!content) {
        showAlert({
          icon: 'error',
          text: 'Ocorreu um problema ao atualizar a consulta',
        });
      }

      const currentDate = new Date();

      setEvents((prev) => {
        const newEvents: Event[] =
          status === '5' && isAfter(eventInfo.start as Date, currentDate)
            ? prev.filter(
                (event) => appointmentId !== idFromResource(event.resource)
              )
            : prev.map((event) =>
                idFromResource(event.resource) === content?.id
                  ? {
                      ...event,
                      resource: `${content?.resource}/${content?.id}/${content?.updatedAt}`,
                    }
                  : event
              );

        return newEvents;
      });

      closeAll('');

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
          'Ocorreu um problema ao atualizar a consulta',
      });
    } finally {
      setLoading(false);
    }
  };

  const updatedAtDisplay = (): string => {
    const updateTime = updatedAtFromResource(eventInfo.resource)
      .split('T')[1]
      .substring(0, 5);
    const updateDate = new Date(updatedAtFromResource(eventInfo.resource));
    updateDate.setHours(Number(updateTime.split(':')[0]));
    updateDate.setMinutes(Number(updateTime.split(':')[1]));

    return dateFormat({
      date: updateDate,
      // eslint-disable-next-line quotes
      stringFormat: "d 'de' MMMM 'de' yyyy 'às' HH:mm",
    });
  };

  return (
    <StyledModal
      open={open}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClose={(event: any, reason: 'backdropClick' | 'escapeKeyDown') =>
        closeAll(reason)
      }
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <StyledBox>
        <Header>
          <IconButton disabled={loading}>
            <MdOutlineStickyNote2
              style={{ fontSize: 35, color: colors.PRIMARY }}
            />
          </IconButton>
          <StatusText>
            Situação: <span>{statusFromResource(eventInfo.resource)}</span>
          </StatusText>
          <IconButton disabled={loading} onClick={() => closeAll('')}>
            <MdOutlineClose style={{ fontSize: 35, color: colors.PRIMARY }} />
          </IconButton>
        </Header>
        <Body>
          <EventPrimaryText>{eventInfo.title}</EventPrimaryText>
          <EventPrimaryText>
            {dateFormat({
              date: eventInfo.start as Date,
              stringFormat: 'HH:mm',
            })}{' '}
            -{' '}
            {dateFormat({ date: eventInfo.end as Date, stringFormat: 'HH:mm' })}
          </EventPrimaryText>

          <AdditionalInfos>
            <AiFillSchedule style={{ fontSize: 70, color: colors.PRIMARY }} />

            <ScheduledAtContainer>
              <ScheduleAtText>Confirmado em:</ScheduleAtText>
              <ScheduleAtDate>{updatedAtDisplay()}</ScheduleAtDate>
            </ScheduledAtContainer>
          </AdditionalInfos>

          <ButtonsContainer>
            {(permissions.includes('CREATE_COMMENTS') ||
              permissions.includes('USER_TYPE_PROFESSIONAL')) && (
              <StyledConfirmButton
                disabled={loading || !permissions.includes('CREATE_COMMENTS')}
                onClick={() =>
                  navigate('/comment/creation', { state: eventInfo })
                }
              >
                CONCLUIR
              </StyledConfirmButton>
            )}
            {(permissions.includes('UPDATE_APPOINTMENTS') ||
              permissions.includes('USER_TYPE_EMPLOYEE')) && (
              <StyledCancelButton
                disabled={loading}
                onClick={() => updateStatus('5')}
              >
                {loading ? (
                  <CircularProgress style={{ color: '#FFF' }} size={20} />
                ) : (
                  'AUSÊNCIA'
                )}
              </StyledCancelButton>
            )}
          </ButtonsContainer>
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(ConfirmedEventModal);
