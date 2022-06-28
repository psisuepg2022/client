import React from 'react';
import { IconButton } from '@mui/material';
import {
  ClinicTitle,
  Container,
  DayTitle,
  EarlyContent,
  LatterContent,
  MiddleContent,
  StyledMenuItem,
  TodayButton,
} from './styles';
import { AiOutlineUser, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { FormProvider, useForm } from 'react-hook-form';
import ControlledSelect from '../ControlledSelect';

const TopToolbar = (): JSX.Element => {
  const formMethods = useForm();
  const {} = formMethods;

  return (
    <Container>
      <EarlyContent>
        <ClinicTitle>KLINIK</ClinicTitle>
      </EarlyContent>

      <MiddleContent>
        <IconButton>
          <AiOutlineLeft style={{ color: '#FFF', fontSize: 30 }} />
        </IconButton>
        <DayTitle>6 de junho de 2022</DayTitle>
        <IconButton>
          <AiOutlineRight style={{ color: '#FFF', fontSize: 30 }} />
        </IconButton>
      </MiddleContent>

      <LatterContent>
        <TodayButton variant="outlined">Hoje</TodayButton>

        <FormProvider {...formMethods}>
          <ControlledSelect name="mode" label="Modo" defaultValue={0}>
            <StyledMenuItem value={0}>Dia</StyledMenuItem>
            <StyledMenuItem value={1}>Semana</StyledMenuItem>
            <StyledMenuItem value={2}>Mês</StyledMenuItem>
          </ControlledSelect>
        </FormProvider>

        <IconButton>
          <AiOutlineUser style={{ fontSize: 40, color: '#FFF' }} />
        </IconButton>
      </LatterContent>
    </Container>
  );
};

export default TopToolbar;
