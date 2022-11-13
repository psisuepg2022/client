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

type ProfessionalScheduleWorkHoursHelpProps = {
  open: boolean;
  handleClose: (reason: 'backdropClick' | 'escapeKeyDown' | '') => void;
};

const ProfessionalScheduleWorkHoursHelp = ({
  open,
  handleClose,
}: ProfessionalScheduleWorkHoursHelpProps): JSX.Element => {
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
          <EventPrimaryText>Horários de expediente</EventPrimaryText>
          <IconButton onClick={() => closeAll('')}>
            <MdOutlineClose style={{ fontSize: 35, color: colors.PRIMARY }} />
          </IconButton>
        </Header>
        <Body>
          <div style={{ textIndent: '2rem' }}>
            <StatusText>
              {`Para cada dia da semana estão disponíveis os campos para a
              configuração dos horários de atendimento. O intervalo entre os
              horários deve respeitar a duração base da consulta, indicada na
              linha: "Início e fim do expediente".`}
            </StatusText>
          </div>

          <SectionDivider>Início e fim do expediente</SectionDivider>

          <div style={{ textIndent: '2rem' }}>
            <ScheduleAtText>
              {`Os campos "Início" e "Fim" devem ser preenchidos selecionando o
              ícone de relógio e escolhendo o horário na interface. Caso o dia
              não tenha expediente, é possível clicar na caixa de seleção "Dia
              da semana sem expediente".`}
            </ScheduleAtText>
          </div>

          <SectionDivider>Intervalos</SectionDivider>

          <div style={{ textIndent: '2rem' }}>
            <ScheduleAtText>
              Caso o horário de expediente esteja correto e permita janelas do
              mesmo tamanho da duração base das consultas, a escolha de
              intervalos (horários sem atendimento) será liberada logo abaixo.
            </ScheduleAtText>
          </div>
        </Body>
      </StyledBox>
    </StyledModal>
  );
};

export default React.memo(ProfessionalScheduleWorkHoursHelp);
