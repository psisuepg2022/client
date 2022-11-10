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

type LiableHelpModalProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
};

const LiableHelpModal = ({
  open,
  handleClose,
}: LiableHelpModalProps): JSX.Element => {
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
          <EventPrimaryText>Responsável</EventPrimaryText>
          <IconButton onClick={() => closeAll('')}>
            <MdOutlineClose style={{ fontSize: 35, color: colors.PRIMARY }} />
          </IconButton>
        </Header>
        <Body>
          <div style={{ textIndent: '2rem' }}>
            <StatusText>
              {`Caso o paciente não possua um documento CPF ou necessite de um
              responsável, a caixa "Paciente precisa de responsável" deve ser
              marcada.`}
            </StatusText>
          </div>

          <SectionDivider>Responsável existente</SectionDivider>

          <div style={{ textIndent: '2rem' }}>
            <ScheduleAtText>
              O primeiro campo a ser preenchido é o nome do responsável, caso o
              responsável já esteja cadastrado para outro paciente, é possível
              buscá-lo no campo, digitando ao menos três caracteres e aguardar a
              busca. As opções serão exibidas em seguida, basta selecionar o
              responsável correspondente e os dados restantes serão preenchidos
              automaticamente.
            </ScheduleAtText>
          </div>

          <SectionDivider>Novo responsável</SectionDivider>

          <div style={{ textIndent: '2rem' }}>
            <ScheduleAtText>
              {`No caso de um
              novo cadastro, deve ser selecionada a opção para criar e dar continuidade ao preenchimento de dados.`}
            </ScheduleAtText>
          </div>
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(LiableHelpModal);
