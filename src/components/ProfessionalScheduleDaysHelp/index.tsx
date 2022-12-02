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

type ProfessionalScheduleDaysHelpProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
  config?: boolean;
};

const ProfessionalScheduleDaysHelp = ({
  open,
  handleClose,
  config,
}: ProfessionalScheduleDaysHelpProps): JSX.Element => {
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
          <EventPrimaryText>Seletores de dias da semana</EventPrimaryText>
          <IconButton onClick={() => closeAll('')}>
            <MdOutlineClose style={{ fontSize: 35, color: colors.PRIMARY }} />
          </IconButton>
        </Header>
        <Body>
          <StatusText>
            Abaixo encontram-se representados os sete dias da semana, de domingo
            à sábado. Para configurar seus horários de atendimento é necessário
            clicar no dia que deseja alterar. O dia selecionado ficará com uma
            borda inferior da cor verde.
          </StatusText>

          <SectionDivider>Propagação de horários</SectionDivider>

          <ScheduleAtText>
            {
              'Os horários escolhidos para cada dia da semana serão propagados para os mesmos dias de todas as semanas.'
            }
          </ScheduleAtText>

          <SectionDivider>Salvando alterações</SectionDivider>

          {config ? (
            <ScheduleAtText>
              Na etapa de configuração é preciso preencher todos os dias da
              semana antes de salvar para prosseguir. Caso não tenha preenchido
              algum dia e tente salvar, uma caixa de diálogo aparecerá avisando.
            </ScheduleAtText>
          ) : (
            <ScheduleAtText>
              Ao alterar os horários por meio do perfil, deve-se salvar as
              alterações para cada dia, antes de mudar o seletor do dia da
              semana. Caso prossiga sem salvar antes, uma caixa de diálogo será
              mostrada, dando a escolha de descartar as alterações ou voltar
              para salvá-las.
            </ScheduleAtText>
          )}
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(ProfessionalScheduleDaysHelp);
