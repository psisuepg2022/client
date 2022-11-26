import React, { useState } from 'react';
import {
  AdditionalInfos,
  Body,
  ButtonsContainer,
  ContactNumberText,
  EventPrimaryText,
  Header,
  IconButtonArea,
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
import { AiFillSchedule, AiOutlineWhatsApp } from 'react-icons/ai';
import { BiLinkExternal } from 'react-icons/bi';
import { colors } from '@global/colors';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { Event } from 'react-big-calendar';
import { useSchedule } from '@contexts/Schedule';
import {
  contactNumberFromResource,
  idFromResource,
  statusFromResource,
  updatedAtFromResource,
} from '@utils/schedule';
import { showAlert } from '@utils/showAlert';
import { dateFormat } from '@utils/dateFormat';
import { isAfter, isBefore } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/Auth';
import { contactNumberToWhatsapp } from '@utils/whatsappContact';

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
          status === '5' && isAfter(eventInfo.start as Date, currentDate)
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
      setLoading(false);
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

  const concludeCheck = (): void => {
    const checkDate = isBefore(new Date(), eventInfo.end as Date);

    if (checkDate) {
      showAlert({
        icon: 'warning',
        title: 'Atenção!',
        text: 'Você está prestes a concluir uma consulta futura. Deseja continuar?',
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonColor: colors.PRIMARY,
        confirmButtonText: 'CONTINUAR',
        cancelButtonColor: colors.BACKGREY,
        cancelButtonText: '<span style="color: #000;"> CANCELAR</span>',
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          navigate('/comment/creation', { state: eventInfo });
        }
      });
    } else {
      navigate('/comment/creation', { state: eventInfo });
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
          <MdOutlineClose style={{ fontSize: 35, color: 'transparent' }} />
          <StatusText>
            Situação: <span>{statusFromResource(eventInfo.resource)}</span>
          </StatusText>
          <IconButton disabled={loading} onClick={() => closeAll('')}>
            <MdOutlineClose style={{ fontSize: 35, color: colors.PRIMARY }} />
          </IconButton>
        </Header>
        <Body>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '0px',
              paddingTop: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <EventPrimaryText>{eventInfo.title}</EventPrimaryText>
              <Tooltip title="Navegar para detalhes do paciente">
                <IconButtonArea>
                  <Link
                    to={{ pathname: '/patients' }}
                    onClick={() => {
                      localStorage.setItem(
                        '@psis:goToPatient',
                        `${eventInfo.title}`
                      );
                    }}
                    style={{ height: '20px', width: '20px' }}
                    target="_blank"
                  >
                    <BiLinkExternal
                      style={{
                        color: colors.PRIMARY,
                      }}
                      size={20}
                    />
                  </Link>
                </IconButtonArea>
              </Tooltip>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              <ContactNumberText>
                Contato:
                <span>
                  {` ${contactNumberFromResource(eventInfo.resource)}`}
                </span>
              </ContactNumberText>
              <Tooltip title="Utilize este número diretamente no WhatsApp">
                <IconButton>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${contactNumberToWhatsapp(
                      contactNumberFromResource(eventInfo.resource)
                    )}`}
                    style={{ height: '1em', width: '1em' }}
                  >
                    <AiOutlineWhatsApp style={{ color: colors.WHATSAPP }} />
                  </a>
                </IconButton>
              </Tooltip>
            </div>
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
              <ScheduleAtText>Confirmado em:</ScheduleAtText>
              <ScheduleAtDate>{updatedAtDisplay()}</ScheduleAtDate>
            </ScheduledAtContainer>
          </AdditionalInfos>

          <ButtonsContainer>
            {(permissions.includes('CREATE_COMMENTS') ||
              permissions.includes('USER_TYPE_PROFESSIONAL')) && (
              <StyledConfirmButton
                disabled={loading || !permissions.includes('CREATE_COMMENTS')}
                onClick={concludeCheck}
              >
                REALIZAR ANOTAÇÕES
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
