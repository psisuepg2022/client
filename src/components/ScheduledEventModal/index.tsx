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
import { format } from 'date-fns';
import { Event } from 'react-big-calendar';
import { useSchedule } from '@contexts/Schedule';
import { idFromResource, statusFromResource } from '@utils/schedule';
import { showAlert } from '@utils/showAlert';

type ScheduledEventModalProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
  eventInfo: Event | undefined;
};

const ScheduledEventModal = ({
  open,
  handleClose,
  eventInfo,
}: ScheduledEventModalProps): JSX.Element => {
  const { updateAppointmentStatus, setEvents } = useSchedule();
  const [loading, setLoading] = useState<boolean>(false);

  console.log('EVENT', eventInfo);

  if (!eventInfo) return <></>;

  if (eventInfo && !eventInfo.title) return <></>;

  const closeAll = (reason: 'backdropClick' | 'escapeKeyDown' | ''): void => {
    handleClose(reason);
  };

  const updateStatus = async () => {
    try {
      setLoading(true);
      const appointmentId = idFromResource(eventInfo.resource);
      const { content, message } = await updateAppointmentStatus(
        appointmentId,
        '3'
      );

      if (!content) {
        showAlert({
          icon: 'error',
          text: 'Ocorreu um problema ao atualizar a consulta',
        });
      }

      setEvents((prev) => {
        const newEvents: Event[] = prev.map((event) =>
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
            {format(eventInfo.start as Date, 'hh:mm')} -{' '}
            {format(eventInfo.end as Date, 'hh:mm')}
          </EventPrimaryText>

          <AdditionalInfos>
            <AiFillSchedule style={{ fontSize: 70, color: colors.PRIMARY }} />

            <ScheduledAtContainer>
              <ScheduleAtText>Agendada em:</ScheduleAtText>
              <ScheduleAtDate>4 de junho de 2022 às 09:42</ScheduleAtDate>
            </ScheduledAtContainer>
          </AdditionalInfos>

          <ButtonsContainer>
            <StyledConfirmButton disabled={loading} onClick={updateStatus}>
              {loading ? (
                <CircularProgress style={{ color: '#FFF' }} size={20} />
              ) : (
                'CONFIRMAR'
              )}
            </StyledConfirmButton>
            <StyledCancelButton disabled={loading}>CANCELAR</StyledCancelButton>
          </ButtonsContainer>
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(ScheduledEventModal);
