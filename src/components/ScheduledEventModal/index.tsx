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
import { MdOutlineClose } from 'react-icons/md';
import { AiFillSchedule } from 'react-icons/ai';
import { BiLinkExternal } from 'react-icons/bi';
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
import { useAuth } from '@contexts/Auth';
import { Link } from 'react-router-dom';

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
  const {
    user: { permissions },
  } = useAuth();
  const [loading, setLoading] = useState<string>('');

  if (!eventInfo) return <></>;

  if (eventInfo && !eventInfo.title && !eventInfo.resource) return <></>;

  const closeAll = (reason: 'backdropClick' | 'escapeKeyDown' | ''): void => {
    handleClose(reason);
  };

  const updateStatus = async (status: string) => {
    try {
      setLoading(status);
      const appointmentId = idFromResource(eventInfo.resource);
      const { content, success } = await updateAppointmentStatus(
        appointmentId,
        status
      );

      if (!success) {
        showAlert({
          icon: 'error',
          text: 'Ocorreu um problema ao atualizar a consulta',
        });
      }

      const currentDate = new Date();

      setEvents((prev) => {
        const newEvents: Event[] =
          status === '2' && isAfter(eventInfo.start as Date, currentDate)
            ? prev.filter(
                (event) => appointmentId !== idFromResource(event.resource)
              )
            : prev.map((event) =>
                idFromResource(event.resource) === content?.id
                  ? {
                      ...event,
                      resource: `${content?.resource}/${content?.contactNumber}/${content?.id}/${content?.updatedAt}`,
                    }
                  : event
              );

        return newEvents;
      });

      closeAll('');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        icon: 'error',
        text:
          e?.response?.data?.message ||
          'Ocorreu um problema ao atualizar a consulta',
      });
    } finally {
      setLoading('');
    }
  };

  const updatedAtDisplay = (): string => {
    const updateTime = updatedAtFromResource(eventInfo.resource)
      .split('T')[1]
      .substring(0, 5);
    const updateDate = new Date(updatedAtFromResource(eventInfo.resource));
    updateDate.setHours(
      Number(updateTime.split(':')[0]),
      Number(updateTime.split(':')[1]),
      0
    );

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
          <MdOutlineClose style={{ fontSize: 35, color: 'transparent' }} />
          <StatusText>
            Situação: <span>{statusFromResource(eventInfo.resource)}</span>
          </StatusText>
          <IconButton disabled={loading !== ''} onClick={() => closeAll('')}>
            <MdOutlineClose style={{ fontSize: 35, color: colors.PRIMARY }} />
          </IconButton>
        </Header>
        <Body>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <EventPrimaryText>{eventInfo.title}</EventPrimaryText>
            <Link
              to={{ pathname: '/patients' }}
              onClick={() => {
                localStorage.setItem('@psis:goToPatient', `${eventInfo.title}`);
              }}
              target="_blank"
            >
              <IconButton>
                <BiLinkExternal style={{ color: colors.PRIMARY }} />
              </IconButton>
            </Link>
          </div>
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
              <ScheduleAtText>Agendado em:</ScheduleAtText>
              <ScheduleAtDate>{updatedAtDisplay()}</ScheduleAtDate>
            </ScheduledAtContainer>
          </AdditionalInfos>

          {(permissions.includes('UPDATE_APPOINTMENTS') ||
            permissions.includes('USER_TYPE_EMPLOYEE')) && (
            <ButtonsContainer>
              <StyledConfirmButton
                disabled={loading === '3'}
                onClick={() => updateStatus('3')}
              >
                {loading === '3' ? (
                  <CircularProgress style={{ color: '#FFF' }} size={20} />
                ) : (
                  'CONFIRMAR'
                )}
              </StyledConfirmButton>
              <StyledCancelButton
                disabled={loading === '2'}
                onClick={() => updateStatus('2')}
              >
                {loading === '2' ? (
                  <CircularProgress style={{ color: '#FFF' }} size={20} />
                ) : (
                  'CANCELAR'
                )}
              </StyledCancelButton>
            </ButtonsContainer>
          )}
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(ScheduledEventModal);
