/* eslint-disable quotes */
import React, { useState } from 'react';
import { Event } from 'react-big-calendar';
import { dateFormat } from '@utils/dateFormat';
import {
  Body,
  Header,
  LockInfoText,
  SlotDataText,
  StyledBox,
  StyledButton,
  StyledModal,
} from './styles';
import { MdOutlineClose, MdLock } from 'react-icons/md';
import { CircularProgress, IconButton } from '@mui/material';
import { useSchedule } from '@contexts/Schedule';
import { useAuth } from '@contexts/Auth';
import { idFromResource } from '@utils/schedule';
import { colors } from '@global/colors';
import { showAlert } from '@utils/showAlert';

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
  const { deleteScheduleLock, setEvents } = useSchedule();
  const {
    user: { permissions },
  } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  if (!eventInfo) return <></>;

  if (eventInfo && !eventInfo.resource) return <></>;

  const closeAll = (reason: 'backdropClick' | 'escapeKeyDown' | '') => {
    handleClose(reason);
  };

  const handleDelete = async (): Promise<void> => {
    try {
      setLoading(true);
      const lockId = idFromResource(eventInfo.resource);

      await deleteScheduleLock(lockId);

      setEvents((prev) => {
        const removeDeletedLock = prev.filter(
          (item) => idFromResource(item.resource) !== lockId
        );

        return removeDeletedLock;
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        icon: 'error',
        text:
          e?.response?.data?.message ||
          'Ocorreu um problema ao deletar o bloqueio',
      });
    } finally {
      setLoading(false);
      closeAll('');
    }
  };

  return (
    <>
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
            <MdOutlineClose size={40} style={{ color: '#FFF' }} />
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
            <IconButton
              disabled={loading}
              size="small"
              onClick={() => closeAll('')}
            >
              <MdOutlineClose size={40} />
            </IconButton>
          </Header>
          <Body>
            <MdLock size={100} style={{ color: colors.DANGER }} />
            <LockInfoText>Este horário possui um bloqueio</LockInfoText>
            {permissions.includes('DELETE_SCHEDULE_LOCK') && (
              <StyledButton disabled={loading} onClick={handleDelete}>
                {loading ? (
                  <CircularProgress style={{ color: '#FFF' }} size={20} />
                ) : (
                  'DELETAR BLOQUEIO'
                )}
              </StyledButton>
            )}
          </Body>
        </StyledBox>
      </StyledModal>
    </>
  );
};

export default LockEventModal;
