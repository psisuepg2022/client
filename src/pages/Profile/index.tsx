import React from 'react';
import { Typography } from '@mui/material';
import {
  Box,
  ButtonContainer,
  Container,
  Content,
  Form,
  Header,
  PersonalInfo,
  PersonalInfoHalf,
  StyledButton,
} from './styles';
import { AiOutlineLeft } from 'react-icons/ai';
import { colors } from '../../global/colors';
import { FormProvider, useForm } from 'react-hook-form';
import ControlledDatePicker from '../../components/ControlledDatePicker';
import ControlledInput from '../../components/ControlledInput';
import SectionDivider from '../../components/SectionDivider';

const Profile = (): JSX.Element => {
  const formMethods = useForm();
  const { handleSubmit } = formMethods;

  const onSubmit = (data: any): void => {
    console.log('DATA', data);
  };

  return (
    <Container>
      <Box>
        <Content>
          <Header>
            <AiOutlineLeft style={{ color: colors.TEXT, fontSize: '2.5rem' }} />
            <Typography fontSize={'2.5rem'}>Perfil da Clínica</Typography>
          </Header>

          <FormProvider {...formMethods}>
            <Form id="form" onSubmit={handleSubmit(onSubmit)}>
              <SectionDivider>Dados da Clínica</SectionDivider>

              <PersonalInfo>
                <ControlledInput
                  name="clinicName"
                  label="Nome"
                  required
                  defaultValue="KLINIK"
                />
                <ControlledInput
                  name="clinicEmail"
                  label="Email"
                  defaultValue="klinik@email.com"
                />
              </PersonalInfo>

              <SectionDivider>Dados do Responsável</SectionDivider>

              <PersonalInfo>
                <ControlledInput
                  name="name"
                  label="Nome"
                  required
                  defaultValue="Peter Doppler"
                />
                <ControlledInput
                  name="email"
                  label="Email"
                  defaultValue="peter.doppler@email.com"
                />

                <PersonalInfoHalf>
                  <ControlledInput
                    name="cpf"
                    label="CPF"
                    required
                    defaultValue="00000000000"
                    mask={(s: string): string =>
                      `${s
                        .replace(/\D/g, '')
                        .replace(/(\d{3})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d)/, '$1-$2')
                        .replace(/(-\d{2})\d+?$/, '$1')}`
                    }
                  />
                  <ControlledDatePicker
                    name="birthday"
                    label="Data de nascimento"
                  />
                </PersonalInfoHalf>

                <PersonalInfoHalf>
                  <ControlledInput
                    name="phone"
                    label="Telefone"
                    required
                    defaultValue="00000000000"
                    mask={(s: string): string =>
                      `${s
                        .replace(/\D/g, '')
                        .replace(/(\d{2})(\d)/, '($1) $2')
                        .replace(/(\d{5})(\d)/, '$1-$2')
                        .replace(/(-\d{4})\d+?$/, '$1')}`
                    }
                  />
                </PersonalInfoHalf>
              </PersonalInfo>
            </Form>
          </FormProvider>
          <ButtonContainer>
            <div />
            <StyledButton type="submit" form="form">
              SALVAR
            </StyledButton>
          </ButtonContainer>
        </Content>
      </Box>
    </Container>
  );
};

export default Profile;
