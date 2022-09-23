/* eslint-disable quotes */
import React, { useState } from 'react';
import { Event } from 'react-big-calendar';
import { dateFormat } from '@utils/dateFormat';
import { Header, SlotDataText, StyledBox, StyledModal } from './styles';
import { MdOutlineClose } from 'react-icons/md';
import { IconButton } from '@mui/material';
import { useSchedule } from '@contexts/Schedule';
import { useAuth } from '@contexts/Auth';

type LockEventModalProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
  eventInfo: Event | undefined;
};

const LockEventModal = ({
  open,
  handleClose,
  eventInfo,
}: LockEventModalProps): JSX.Element => {
  const {} = useSchedule();
  const {
    user: { permissions },
  } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  if (!eventInfo) return <></>;

  if (eventInfo && !eventInfo.resource) return <></>;

  const closeAll = (reason: 'backdropClick' | 'escapeKeyDown' | '') => {
    handleClose(reason);
  };

  return (
    <>
      <StyledModal
        open={open}
        onClose={() => closeAll('')}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledBox>
          <Header>
            <SlotDataText>
              {dateFormat({
                date: eventInfo.start as Date,
                stringFormat: "d 'de' MMMM 'de' yyyy",
              })}{' '}
              |{' '}
              {dateFormat({
                date: eventInfo.start as Date,
                stringFormat: 'HH:mm',
              })}{' '}
              -{' '}
              {dateFormat({
                date: eventInfo.end as Date,
                stringFormat: 'HH:mm',
              })}
            </SlotDataText>
            <IconButton size="small" onClick={() => closeAll('')}>
              <MdOutlineClose size={40} />
            </IconButton>
          </Header>
        </StyledBox>
      </StyledModal>
    </>
  );
};

export default LockEventModal;
