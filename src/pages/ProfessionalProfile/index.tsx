import React, { useEffect, useState } from 'react';
import { IconButton, Typography } from '@mui/material';
import {
  Box,
  ButtonContainer,
  Container,
  Content,
  Form,
  Header,
  LogoContainer,
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
import { showAlert } from '@utils/showAlert';
import CircularProgressWithContent from '@components/CircularProgressWithContent';
import logoPSIS from '@assets/PSIS-Logo-Invertido-Transparente.png';
import { useProfessionals } from '@contexts/Professionals';
import { Address } from '@models/Address';

type ProfileFormProps = {
  name: string;
  email?: string;
  birthdate: string;
  CPF: string;
  contactNumber?: string;
  profession: string;
  registry: string;
  specialization?: string;
  address?: Address;
};

const ProfessionalProfile = (): JSX.Element => {
  const formMethods = useForm<ProfileFormProps>();
  const { getProfile } = useProfessionals();
  const { handleSubmit, setValue } = formMethods;
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const { content } = await getProfile();

        console.log('GET PROFILE', content);

        setValue('name', content?.name || '');
        setValue('email', content?.email || '');
        setValue('CPF', content?.CPF || '');
        setValue('birthdate', content?.birthDate || '');
        setValue('contactNumber', content?.contactNumber || '');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        showAlert({
          icon: 'error',
          text:
            e?.response?.data?.message ||
            'Ocorreu um problema ao carregar seu perfil de usuário',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSubmit = (data: FieldValues): void => {
    const formData: ProfileFormProps = data as ProfileFormProps;
    console.log('DATA', formData);
  };

  if (loading)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100vh',
        }}
      >
        <CircularProgressWithContent
          content={<LogoContainer src={logoPSIS} />}
          size={200}
        />
      </div>
    );

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
              <SectionDivider>Dados Pessoais</SectionDivider>

              <PersonalInfo>
                <ControlledInput
                  name="name"
                  label="Nome"
                  rules={{
                    required: {
                      value: true,
                      message: 'O nome do responsável é obrigatório',
                    },
                  }}
                />
                <ControlledInput name="email" label="Email" />

                <PersonalInfoHalf>
                  <ControlledInput
                    name="CPF"
                    label="CPF"
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
                    name="contactNumber"
                    label="Telefone"
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

export default ProfessionalProfile;
