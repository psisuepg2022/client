import React from 'react';
import {
  Body,
  EventPrimaryText,
  Header,
  ScheduleAtText,
  StatusText,
  StyledBox,
  StyledModal,
} from './styles';
import { MdOutlineClose } from 'react-icons/md';
import { colors } from '@global/colors';
import { IconButton } from '@mui/material';
import SectionDivider from '@components/SectionDivider';

type PersonalDataHelpModalProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
};

const PersonalDataHelpModal = ({
  open,
  handleClose,
}: PersonalDataHelpModalProps): JSX.Element => {
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
          <EventPrimaryText>Dados pessoais</EventPrimaryText>
          <IconButton onClick={() => closeAll('')}>
            <MdOutlineClose style={{ fontSize: 35, color: colors.PRIMARY }} />
          </IconButton>
        </Header>
        <Body>
          <SectionDivider>Estado civil</SectionDivider>

          <div>
            <ScheduleAtText>
              União estável não consta na lista de opções por não ser um estado
              civil válido, a união estável é enquadrada na categoria de
              Solteiro(a).
            </ScheduleAtText>
          </div>
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(PersonalDataHelpModal);
