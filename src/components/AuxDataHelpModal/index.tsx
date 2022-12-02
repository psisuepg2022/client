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
          <EventPrimaryText>Dados auxiliares</EventPrimaryText>
          <IconButton onClick={() => closeAll('')}>
            <MdOutlineClose style={{ fontSize: 35, color: colors.PRIMARY }} />
          </IconButton>
        </Header>
        <Body>
          <StatusText>
            Dados auxiliares englobam informações sobre o endereço do paciente e
            um número de telefone para contato.
          </StatusText>

          <SectionDivider>Endereço</SectionDivider>

          <ScheduleAtText>
            É possível incluir o endereço do paciente, para isso é necessário
            inserir primeiramente o CEP, pois ele irá preencher automaticamente
            os outros campos. Caso o CEP em questão não possua logradouro ou
            bairro, é possível preencher esses campos manualmente.
          </ScheduleAtText>

          <SectionDivider>Contato</SectionDivider>

          <ScheduleAtText>
            É necessário inserir um número de telefone válido (sem pontuação)
            para contato com o paciente em caso de agendamento, confirmação ou
            cancelamento de consultas.{' '}
          </ScheduleAtText>
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(AuxDataHelpModal);
