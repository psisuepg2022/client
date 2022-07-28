import { FormControlLabel } from '@mui/material';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import AlterTopToolbar from '../../components/AlterTopToolbar';
import ControlledInput from '../../components/ControlledInput';
import ControlledSelect from '../../components/ControlledSelect';
import SectionDivider from '../../components/SectionDivider';
import {
  AuxDataFirst,
  AuxDataSecond,
  BoxHeader,
  ButtonsContainer,
  Container,
  Content,
  CustomBox,
  PageTitle,
  PersonalDataFirst,
  PersonalDataSecond,
  StyledButton,
  StyledButtonInverted,
  StyledCheckbox,
  StyledForm,
  StyledMenuItem,
} from './styles';

const PatientsForm = (): JSX.Element => {
  const formMethods = useForm();
  const [needLiable, setNeedLiable] = useState<boolean>(false);

  return (
    <Container>
      <AlterTopToolbar />
      <Content>
        <CustomBox>
          <div>
            <BoxHeader>
              <PageTitle>Criar Paciente</PageTitle>
            </BoxHeader>
            <FormProvider {...formMethods}>
              <StyledForm>
                <SectionDivider>Dados Pessoais</SectionDivider>
                <PersonalDataFirst>
                  <ControlledInput name="name" label="Nome" />
                  <ControlledInput name="email" label="Email" />
                </PersonalDataFirst>
                <PersonalDataSecond>
                  <ControlledInput name="name" label="Nome" />
                  <ControlledInput name="email" label="Email" />
                  <ControlledSelect
                    defaultValue={1}
                    name="maritalStatus"
                    label="Estado civil"
                  >
                    <StyledMenuItem value={1}>Casado(a)</StyledMenuItem>
                    <StyledMenuItem value={2}>Solteiro(a)</StyledMenuItem>
                    <StyledMenuItem value={3}>Divorciado(a)</StyledMenuItem>
                    <StyledMenuItem value={4}>Viúvo(a)</StyledMenuItem>
                  </ControlledSelect>
                  <ControlledSelect
                    defaultValue={1}
                    name="gender"
                    label="Gênero"
                  >
                    <StyledMenuItem value={1}>Masculino</StyledMenuItem>
                    <StyledMenuItem value={2}>Feminino</StyledMenuItem>
                    <StyledMenuItem value={3}>Não-binário</StyledMenuItem>
                    <StyledMenuItem value={4}>Prefiro não dizer</StyledMenuItem>
                  </ControlledSelect>
                </PersonalDataSecond>

                <FormControlLabel
                  style={{ maxWidth: 400 }}
                  control={
                    <StyledCheckbox
                      checked={needLiable}
                      onChange={() => setNeedLiable((prev) => !prev)}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label="Paciente precisa de responsável"
                />

                {needLiable && (
                  <>
                    <SectionDivider>Dados do Responsável</SectionDivider>
                    <PersonalDataFirst>
                      <ControlledInput name="name" label="Nome" />
                      <ControlledInput name="email" label="Email" />
                    </PersonalDataFirst>
                    <PersonalDataSecond>
                      <ControlledInput name="name" label="Nome" />
                      <ControlledInput name="email" label="Email" />
                    </PersonalDataSecond>
                  </>
                )}

                <SectionDivider>Dados Auxiliares</SectionDivider>
                <AuxDataFirst>
                  <ControlledInput name="name" label="Nome" />
                  <ControlledInput name="email" label="Email" />
                  <ControlledInput name="email" label="Email" />
                </AuxDataFirst>
                <AuxDataSecond>
                  <ControlledInput name="name" label="Nome" />
                  <ControlledInput name="email" label="Email" />
                  <ControlledInput
                    name="email"
                    label="Email"
                    style={{ width: '50%' }}
                  />
                </AuxDataSecond>
              </StyledForm>
            </FormProvider>
          </div>

          <ButtonsContainer>
            <StyledButton style={{ gridColumnStart: 3 }}>SALVAR</StyledButton>
            <StyledButtonInverted style={{ gridColumnStart: 4 }}>
              CANCELAR
            </StyledButtonInverted>
          </ButtonsContainer>
        </CustomBox>
      </Content>
    </Container>
  );
};

export default PatientsForm;
