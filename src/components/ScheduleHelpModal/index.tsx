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
import { useAuth } from '@contexts/Auth';

type ScheduleHelpModalProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
};

const ScheduleHelpModal = ({
  open,
  handleClose,
}: ScheduleHelpModalProps): JSX.Element => {
  const {
    user: { permissions },
  } = useAuth();

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
          <EventPrimaryText>Ações da agenda</EventPrimaryText>
          <IconButton onClick={() => closeAll('')}>
            <MdOutlineClose style={{ fontSize: 35, color: colors.PRIMARY }} />
          </IconButton>
        </Header>
        <Body>
          <StatusText>
            {permissions.includes('USER_TYPE_EMPLOYEE')
              ? `
              As ações disponíveis na agenda são: Selecionar o profissional para agendamento, agendar uma consulta, confirmar, cancelar ou declarar ausência (após confirmação).
              `
              : permissions.includes('USER_TYPE_PROFESSIONAL')
              ? `As ações disponíveis na agenda são: Agendar uma consulta (apenas para pacientes que já consultaram ao menos uma vez com o profissional),
                concluir uma consulta e criar uma anotação para a consulta.
                `
              : 'Para o administrador, é possível apenas a visualização das agendas dos profissionais e seus eventos, e a navegação pelo calendário, não sendo possível realizar ações de agendamento.'}
          </StatusText>

          {permissions.includes('USER_TYPE_EMPLOYEE') ? (
            <>
              <SectionDivider>Seleção de profissional</SectionDivider>

              <ScheduleAtText>
                {`Os agendamentos podem ser feitos para todos os profissionais da clínica, portanto é necessário selecionar o profissional desejado na
                  barra acima da agenda, clicando no nome para prosseguir com o agendamento para aquele profissional.
                  `}
              </ScheduleAtText>
            </>
          ) : null}

          {permissions.includes('USER_TYPE_EMPLOYEE') ||
          permissions.includes('USER_TYPE_PROFESSIONAL') ? (
            <>
              <SectionDivider>Agendamento</SectionDivider>

              <ScheduleAtText>
                {permissions.includes('USER_TYPE_EMPLOYEE')
                  ? `
                  Para realizar o agendamento de uma consulta, é necessário navegar para o dia pretendido utilizando a barra superior da agenda, no dia, clicar em um espaço da agenda disponível,
                  na caixa de diálogo aberta, inserir ao menos três caracteres do nome do paciente e aguardar aproximadamente um segundo para a busca do paciente. Caso o paciente já esteja cadastrado,
                  seu nome aparecerá na lista para seleção, é preciso clicar no nome do paciente para que as informações de confirmação sejam trazidas. Se confirmadas as informações, é necessário um 
                  clique no botão "AGENDAR" para concluir o agendamento.
                `
                  : `
                Para realizar o agendamento de uma consulta, é necessário navegar para o dia pretendido utilizando a barra superior da agenda, no dia, clicar em um espaço da agenda disponível,
                na caixa de diálogo aberta, inserir ao menos três caracteres do nome do paciente e aguardar aproximadamente um segundo para a busca do paciente, para profissionais, o paciente 
                em questão precisa ter se consultado com o profissional ao menos uma vez para que a busca tenha sucesso. Caso o paciente já esteja cadastrado,
                seu nome aparecerá na lista para seleção, é preciso clicar no nome do paciente para que as informações de confirmação sejam trazidas. Se confirmadas as informações, é necessário um 
                clique no botão "AGENDAR" para concluir o agendamento.
                `}
              </ScheduleAtText>
            </>
          ) : null}

          {permissions.includes('USER_TYPE_EMPLOYEE') ? (
            <>
              <SectionDivider>Confirmação e cancelamento</SectionDivider>

              <ScheduleAtText>
                {`Quando a consulta estiver com status "Agendada", duas ações são liberadas: "CONFIRMAR" e "CANCELAR", ao confirmar a consulta mudará de status. Ao cancelar, se a data da consulta
                    for futura, o evento será removido da agenda, liberando o espaço para reuso, caso a data seja passada, o evento permanecerá na agenda com o status de "Cancelada".`}
              </ScheduleAtText>
            </>
          ) : null}

          {permissions.includes('USER_TYPE_EMPLOYEE') ? (
            <>
              <SectionDivider>Ausência</SectionDivider>

              <ScheduleAtText>
                {`Quando a consulta está com status "Confirmada", o botão de "AUSÊNCIA" é liberado, para quando o paciente confirmar a consulta, mas mesmo assim não comparecer. 
                  Caso a data da consulta seja futura, o evento será removido da agenda, liberando o espaço para reuso, caso a data seja passada, o evento permanecerá na agenda com o status de "Ausente".
                  `}
              </ScheduleAtText>
            </>
          ) : permissions.includes('USER_TYPE_PROFESSIONAL') ? (
            <>
              <SectionDivider>Conclusão</SectionDivider>

              <ScheduleAtText>
                {`Quando a consulta está com status "Confirmada", o botão "CONCLUIR" é liberado para o profissional. Ao clicar nele, será redirecionado para um editor de texto, caso queira
                  fazer uma anotação sobre a consulta (também é possível deixar em branco) e concluir. Caso o mesmo horário da consulta a ser concluída esteja disponível na próxima semana,
                  será oferecido um reagendamento da consulta antes da conclusão.`}
              </ScheduleAtText>
            </>
          ) : null}

          {permissions.includes('USER_TYPE_PROFESSIONAL') ? (
            <>
              <SectionDivider>Horários da agenda</SectionDivider>

              <ScheduleAtText>
                {`Para o profissional, é possível alterar os horários e intervalos escolhidos na hora da configuração, no primeiro acesso. 
                    Basta entrar na página de perfil, no ícone de usuário na barra superior, e na página do perfil clicar no ícone de relógio no canto superior direito.
                    `}
              </ScheduleAtText>
            </>
          ) : null}

          {permissions.includes('USER_TYPE_PROFESSIONAL') ? (
            <>
              <SectionDivider>Bloqueios do profissional</SectionDivider>

              <ScheduleAtText>
                {`O profissional também pode criar um bloqueio de horário para uma data específica. Para isso, basta selecionar um campo de horário disponível na agenda, 
                  clicar no ícone do cadeado vermelho e escolher os horários de início e fim do bloqueio, estes estarão preenchidos inicialmente com os horários do campo
                  selecionado na agenda, mas podem ser alterados, podendo ter a duração de um ou mais espaços de consulta na agenda.
                    `}
              </ScheduleAtText>
            </>
          ) : null}
          <SectionDivider>Situações das consultas na agenda</SectionDivider>

          <ScheduleAtText>
            {
              'Para informações sobre as situações e cores representados na agenda, clique no ícone de informação na página da agenda, ao lado do ícone de ajuda.'
            }
          </ScheduleAtText>
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(ScheduleHelpModal);
