import { colors } from '@global/colors';
import { IconButton } from '@mui/material';
import React from 'react';
import { MdOutlineClose } from 'react-icons/md';
import {
  Body,
  ColorBox,
  ColorRow,
  ColorText,
  Header,
  StatusSectionText,
  StatusText,
  StyledBox,
  StyledModal,
} from './styles';

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
          <StatusText>Legenda para as cores da agenda</StatusText>
          <IconButton onClick={() => closeAll('')}>
            <MdOutlineClose style={{ fontSize: 35, color: colors.PRIMARY }} />
          </IconButton>
        </Header>
        <Body>
          <StatusSectionText>Consultas</StatusSectionText>
          <ColorRow>
            <ColorBox color={colors.SCHEDULED} />
            <ColorText>Agendada</ColorText>
          </ColorRow>
          <ColorRow>
            <ColorBox color={colors.CONFIRMED} />
            <ColorText>Confirmada</ColorText>
          </ColorRow>
          <ColorRow>
            <ColorBox color={colors.CONCLUDED} />
            <ColorText>Concluída</ColorText>
          </ColorRow>
          <ColorRow>
            <ColorBox color={colors.CANCELLED} />
            <ColorText>Cancelada (antes da confirmação)</ColorText>
          </ColorRow>
          <ColorRow>
            <ColorBox color={colors.ABSENCE} />
            <ColorText>Com ausência do paciente</ColorText>
          </ColorRow>
          <StatusSectionText>Agenda</StatusSectionText>
          <ColorRow>
            <ColorBox color="#FFF" />
            <ColorText>Horário disponível</ColorText>
          </ColorRow>
          <ColorRow>
            <ColorBox color={colors.PAST} />
            <ColorText>Horário passado (Não utilizável)</ColorText>
          </ColorRow>
          <ColorRow>
            <ColorBox color={colors.LOCK} />
            <ColorText>Intervalo do dia da semana</ColorText>
          </ColorRow>
          <ColorRow>
            <ColorBox color={colors.LOCK_DARKER} />
            <ColorText>Bloqueio de horário em uma data específica</ColorText>
          </ColorRow>
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(ScheduleLabelModal);
