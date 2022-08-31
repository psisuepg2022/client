import React from 'react';
import { IconButton, Typography } from '@mui/material';
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
import { FiChevronLeft } from 'react-icons/fi';
import { colors } from '@global/colors';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import ControlledDatePicker from '@components/ControlledDatePicker';
import ControlledInput from '@components/ControlledInput';
import SectionDivider from '@components/SectionDivider';
import { useNavigate } from 'react-router-dom';
import { isAfter } from 'date-fns';

type ProfileFormProps = {
  clinic: {
    name: string;
    email: string;
  };
  name: string;
  email?: string;
  contactNumber?: string;
  birthdate: string;
  CPF: string;
};

const Profile = (): JSX.Element => {
  const formMethods = useForm();
  const { handleSubmit } = formMethods;
  const navigate = useNavigate();

  const onSubmit = (data: FieldValues): void => {
    const formData: ProfileFormProps = data as ProfileFormProps;
    console.log('DATA', formData);
  };

  return (
    <Container>
      <Box>
        <Content>
          <Header>
            <IconButton onClick={() => navigate(-1)}>
              <FiChevronLeft
                style={{ color: colors.TEXT, fontSize: '2.5rem' }}
              />
            </IconButton>
            <Typography fontSize={'2.5rem'}>Perfil da Clínica</Typography>
          </Header>

          <FormProvider {...formMethods}>
            <Form id="form" onSubmit={handleSubmit(onSubmit)}>
              <SectionDivider>Dados da Clínica</SectionDivider>

              <PersonalInfo>
                <ControlledInput
                  name="clinic.name"
                  label="Nome"
                  defaultValue="KLINIK"
                  rules={{
                    required: {
                      value: true,
                      message: 'O nome da clínica é obrigatório',
                    },
                  }}
                />
                <ControlledInput
                  name="clinic.email"
                  label="Email"
                  defaultValue="klinik@email.com"
                  rules={{
                    required: {
                      value: true,
                      message: 'O email da clínica é obrigatório',
                    },
                  }}
                />
              </PersonalInfo>

              <SectionDivider>Dados do Responsável</SectionDivider>

              <PersonalInfo>
                <ControlledInput
                  name="name"
                  label="Nome"
                  defaultValue="Peter Doppler"
                  rules={{
                    required: {
                      value: true,
                      message: 'O nome do responsável é obrigatório',
                    },
                  }}
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
                    defaultValue="000.000.000-00"
                    mask={(s: string): string =>
                      `${s
                        .replace(/\D/g, '')
                        .replace(/(\d{3})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d)/, '$1-$2')
                        .replace(/(-\d{2})\d+?$/, '$1')}`
                    }
                    rules={{
                      required: {
                        value: true,
                        message: 'O CPF do responsável é obrigatório',
                      },
                      minLength: {
                        value: 14,
                        message: 'Insira um CPF válido',
                      },
                      maxLength: {
                        value: 14,
                        message: 'Insira um CPF válido',
                      },
                    }}
                  />
                  <ControlledDatePicker
                    name="birthdate"
                    label="Data de nascimento"
                    defaultValue={new Date()}
                    rules={{
                      required: {
                        value: true,
                        message:
                          'A data de nascimento do responsável é obrigatória',
                      },
                      validate: (date) =>
                        !isAfter(date, new Date()) ||
                        'A Data escolhida não pode ser superior à data atual',
                    }}
                  />
                </PersonalInfoHalf>

                <PersonalInfoHalf>
                  <ControlledInput
                    name="phone"
                    label="Telefone"
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
