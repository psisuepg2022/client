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

type ProfessionalConfigPasswordHelpProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
};

const ProfessionalConfigPasswordHelp = ({
  open,
  handleClose,
}: ProfessionalConfigPasswordHelpProps): JSX.Element => {
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
          <EventPrimaryText>Nova senha de acesso</EventPrimaryText>
          <IconButton onClick={() => closeAll('')}>
            <MdOutlineClose style={{ fontSize: 35, color: colors.PRIMARY }} />
          </IconButton>
        </Header>
        <Body>
          <StatusText>
            Por motivos de segurança, é necessária a troca da senha dada ao
            profissional pelo administrador. Insira a senha fornecida pelo
            administrador e escolha uma nova senha diferente para ser usada
            daqui em diante.
          </StatusText>

          <SectionDivider>Requisitos obrigatórios</SectionDivider>

          <ScheduleAtText>
            {
              'A senha deve possuir no mínimo 8 caracteres, letras minúsculas, ao menos uma letra maiúscula e ao menos um número.'
            }
          </ScheduleAtText>
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(ProfessionalConfigPasswordHelp);
