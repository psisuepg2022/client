import { colors } from '@global/colors';
import { IconButton } from '@mui/material';
import React from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { Body, Header, StatusText, StyledBox, StyledModal } from './styles';

type ScheduleLabelModalProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
};

const ScheduleLabelModal = ({
  open,
  handleClose,
}: ScheduleLabelModalProps): JSX.Element => {
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
          <StatusText>
            Legenda para os estados das consultas <span></span>
          </StatusText>
          <IconButton onClick={() => closeAll('')}>
            <MdOutlineClose style={{ fontSize: 35, color: colors.PRIMARY }} />
          </IconButton>
        </Header>
        <Body></Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(ScheduleLabelModal);
