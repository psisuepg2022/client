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
import { MdOutlineClose } from 'react-icons/md';
import { AiFillSchedule } from 'react-icons/ai';
import { colors } from '@global/colors';
import { IconButton } from '@mui/material';

type AuxDataHelpModalProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
};

const AuxDataHelpModal = ({
  open,
  handleClose,
}: AuxDataHelpModalProps): JSX.Element => {
  const closeAll = (reason: 'backdropClick' | 'escapeKeyDown' | ''): void => {
    handleClose(reason);
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
          <StatusText>Informação sobre os dados auxiliares</StatusText>
          <IconButton onClick={() => closeAll('')}>
            <MdOutlineClose style={{ fontSize: 35, color: colors.PRIMARY }} />
          </IconButton>
        </Header>
        <Body>
          <EventPrimaryText>Primary</EventPrimaryText>

          <AdditionalInfos>
            <AiFillSchedule style={{ fontSize: 70, color: colors.PRIMARY }} />

            <ScheduledAtContainer>
              <ScheduleAtText>text</ScheduleAtText>
              <ScheduleAtDate>date</ScheduleAtDate>
            </ScheduledAtContainer>
          </AdditionalInfos>
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(AuxDataHelpModal);
