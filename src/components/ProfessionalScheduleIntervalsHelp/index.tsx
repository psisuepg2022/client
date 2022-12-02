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

type ProfessionalScheduleIntervalsHelpProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
};

const ProfessionalScheduleIntervalsHelp = ({
  open,
  handleClose,
}: ProfessionalScheduleIntervalsHelpProps): JSX.Element => {
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
          <EventPrimaryText>Intervalos</EventPrimaryText>
          <IconButton onClick={() => closeAll('')}>
            <MdOutlineClose style={{ fontSize: 35, color: colors.PRIMARY }} />
          </IconButton>
        </Header>
        <Body>
          <StatusText>
            {`Se o dia selecionado permitir janelas esta seção será desbloqueada.
               Aqui é possível criar intervalos (horários sem atendimento) para o dia em questão. Estes intervalos,
                 assim como os horários de expedientes serão propagados para o dia da semana escolhido de todas as semanas. `}
          </StatusText>

          <SectionDivider>Duração</SectionDivider>

          <ScheduleAtText>
            {`A duração dos intervalos precisa seguir a duração base das consultas, mas o intervalo pode
                corresponder ao tempo de uma ou mais consultas.
              `}
          </ScheduleAtText>

          <SectionDivider>Remoção</SectionDivider>

          <ScheduleAtText>
            É possível remover um intervalo apresentado na listagem clicando no
            ícone de lixeira. No caso de intervalos já salvos, será preciso uma
            confirmação de deleção. Para intervalos ainda não salvos, estes
            serão tirados imediatamente da listagem e descartados.
          </ScheduleAtText>
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(ProfessionalScheduleIntervalsHelp);
