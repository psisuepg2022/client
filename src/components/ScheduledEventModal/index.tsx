import React from 'react';
import {
  AdditionalInfos,
  Body,
  EventPrimaryText,
  Header,
  ScheduleAtDate,
  ScheduleAtText,
  ScheduledAtContainer,
  StatusText,
  StyledBox,
  StyledModal,
} from './styles';
import { MdOutlineClose, MdOutlineStickyNote2 } from 'react-icons/md';
import { AiFillSchedule } from 'react-icons/ai';
import { colors } from '@global/colors';
import { IconButton } from '@mui/material';
import { format } from 'date-fns';
import { ScheduleEvent } from '@interfaces/ScheduleEvent';

type ScheduledEventModalProps = {
  open: boolean;
  handleClose: () => void;
  eventInfo: ScheduleEvent | undefined;
};

const ScheduledEventModal = ({
  open,
  handleClose,
  eventInfo,
}: ScheduledEventModalProps): JSX.Element => {
  if (!eventInfo) return <></>;

  if (eventInfo && !eventInfo.title) return <></>;

  const closeAll = (): void => {
    handleClose();
  };

  return (
    <StyledModal
      open={open}
      onClose={closeAll}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <StyledBox>
        <Header>
          <IconButton>
            <MdOutlineStickyNote2
              style={{ fontSize: 35, color: colors.PRIMARY }}
            />
          </IconButton>
          <StatusText>
            Situação: <span>{eventInfo.resource}</span>
          </StatusText>
          <IconButton>
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
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(ScheduledEventModal);
