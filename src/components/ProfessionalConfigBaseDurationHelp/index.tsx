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

type ProfessionalConfigBaseDurationHelpProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
};

const ProfessionalConfigBaseDurationHelp = ({
  open,
  handleClose,
}: ProfessionalConfigBaseDurationHelpProps): JSX.Element => {
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
          <EventPrimaryText>Duração base das consultas</EventPrimaryText>
          <IconButton onClick={() => closeAll('')}>
            <MdOutlineClose style={{ fontSize: 35, color: colors.PRIMARY }} />
          </IconButton>
        </Header>
        <Body>
          <div style={{ textIndent: '2rem' }}>
            <StatusText>
              O profissional deve escolher uma duração base para suas consultas,
              isto é, quanto tempo cada consulta irá durar. Este campo deve ser
              preenchido na seção abaixo com a duração em minutos. Note o aviso
              de que a duração não poderá ser alterada posteriormente pelo
              usuário, necessitando de um contato com o administrador.
            </StatusText>
          </div>

          <SectionDivider>Por que existe a duração base?</SectionDivider>

          <div style={{ textIndent: '2rem' }}>
            <ScheduleAtText>
              {
                'A duração base das consultas serve para pavimentar a agenda, definindo os limites, as janelas de horário e intervalos. Toda a agenda do profissional será construída em volta dessa duração.'
              }
            </ScheduleAtText>
          </div>
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(ProfessionalConfigBaseDurationHelp);
