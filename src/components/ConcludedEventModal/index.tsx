import React from 'react';
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
  StyledConfirmButton,
  StyledModal,
} from './styles';
import { MdOutlineClose } from 'react-icons/md';
import { AiFillSchedule } from 'react-icons/ai';
import { colors } from '@global/colors';
import { IconButton, Tooltip } from '@mui/material';
import { Event } from 'react-big-calendar';
import { statusFromResource, updatedAtFromResource } from '@utils/schedule';
import { dateFormat } from '@utils/dateFormat';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/Auth';

type ConcludedEventModalProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
  eventInfo: Event | undefined;
};

const ConcludedEventModal = ({
  open,
  handleClose,
  eventInfo,
}: ConcludedEventModalProps): JSX.Element => {
  const navigate = useNavigate();
  const {
    user: { permissions },
  } = useAuth();

  if (!eventInfo) return <></>;

  if (eventInfo && !eventInfo.title) return <></>;

  const closeAll = (reason: 'backdropClick' | 'escapeKeyDown' | ''): void => {
    handleClose(reason);
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
          <IconButton onClick={() => closeAll('')}>
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
              <ScheduleAtText>Concluído em:</ScheduleAtText>
              <ScheduleAtDate>{updatedAtDisplay()}</ScheduleAtDate>
            </ScheduledAtContainer>
          </AdditionalInfos>

          {(permissions.includes('READ_COMMENTS') ||
            permissions.includes('USER_TYPE_PROFESSIONAL')) && (
            <ButtonsContainer>
              <Tooltip
                title={
                  !permissions.includes('READ_COMMENTS')
                    ? 'Somente o profissional responsável pode visualizar as anotações'
                    : ''
                }
              >
                <span>
                  <StyledConfirmButton
                    disabled={!permissions.includes('READ_COMMENTS')}
                    onClick={() => navigate('/comment', { state: eventInfo })}
                  >
                    ABRIR ANOTAÇÃO
                  </StyledConfirmButton>
                </span>
              </Tooltip>
            </ButtonsContainer>
          )}
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(ConcludedEventModal);
