import React, { useEffect, useState } from 'react';
import { IconButton, Typography } from '@mui/material';
import {
  AuxDataFirst,
  AuxDataSecond,
  Box,
  ButtonContainer,
  Container,
  Content,
  Form,
  Header,
  LogoContainer,
  PersonalInfo,
  PersonalInfoHalf,
  ProfessionalData,
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
import SimpleInput from '@components/SimpleInput';
import { CepInfos } from '@interfaces/CepInfos';
import AsyncInput from '@components/AsyncInput';
import { searchForCep } from '@utils/zipCode';
import { AiOutlineClockCircle } from 'react-icons/ai';

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
  const [cepInfos, setCepInfos] = useState<CepInfos | undefined>(undefined);
  const [inputLoading, setInputLoading] = useState<boolean>(false);

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
        setValue('profession', content?.profession || '');
        setValue('registry', content?.registry || '');
        setValue('specialization', content?.specialization || '');

        if (content?.address) {
          setValue('address.zipCode', content.address?.zipCode);
          setCepInfos({
            cep: content?.address.zipCode,
            localidade: content?.address.city,
            logradouro: content?.address.publicArea,
            bairro: content?.address.district,
            uf: content?.address.state,
          });
        }

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

  const handleCepComplete = async (value: string): Promise<CepInfos | void> => {
    if (value.length < 9) {
      cepInfos && setCepInfos(undefined);
      return;
    }

    try {
      setInputLoading(true);
      const infos = (await searchForCep(value)) as CepInfos;

      setCepInfos(infos);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showAlert({
        text: 'Ocorreu um problema ao buscar os dados do CEP',
        icon: 'error',
      });
    } finally {
      setInputLoading(false);
    }
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => navigate(-1)}>
                <FiChevronLeft
                  style={{ color: colors.TEXT, fontSize: '2.5rem' }}
                />
              </IconButton>
              <Typography fontSize={'2.5rem'}>
                Perfil do Profissional
              </Typography>
            </div>
            <IconButton
              disabled={loading || inputLoading}
              onClick={() => navigate('/profile/professional_schedule')}
            >
              <AiOutlineClockCircle
                style={{ color: colors.PRIMARY, fontSize: '2.5rem' }}
              />
            </IconButton>
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
                    defaultValue=""
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
              </PersonalInfo>

              <SectionDivider>Dados Auxiliares</SectionDivider>
              <AuxDataFirst>
                <AsyncInput
                  name="address.zipCode"
                  label="CEP"
                  defaultValue=""
                  onCompleteCep={handleCepComplete}
                  inputLoading={inputLoading}
                  maxLength={9}
                  mask={(s: string): string =>
                    `${s
                      .replace(/\D/g, '')
                      .replace(/(\d{5})(\d)/, '$1-$2')
                      .replace(/(-\d{3})\d+?$/, '$1')}`
                  }
                />
                <SimpleInput
                  name="address.city"
                  label="Cidade"
                  contentEditable={false}
                  value={cepInfos?.localidade || ''}
                />
                {cepInfos?.cep && !cepInfos?.logradouro ? (
                  <ControlledInput
                    name="address.publicArea"
                    label="Logradouro"
                    rules={{
                      validate: (value) =>
                        (cepInfos?.cep && value !== undefined) ||
                        'O logradouro é obrigatório',
                    }}
                  />
                ) : (
                  <SimpleInput
                    name="address.publicArea"
                    label="Logradouro"
                    contentEditable={false}
                    value={cepInfos?.logradouro || ''}
                  />
                )}
              </AuxDataFirst>
              <AuxDataSecond>
                <SimpleInput
                  name="address.state"
                  label="Estado"
                  contentEditable={false}
                  value={cepInfos?.uf || ''}
                />
                {cepInfos?.cep && !cepInfos.bairro ? (
                  <ControlledInput name="address.district" label="Bairro" />
                ) : (
                  <SimpleInput
                    name="address.district"
                    label="Bairro"
                    contentEditable={false}
                    value={cepInfos?.bairro || ''}
                  />
                )}
                <ControlledInput
                  name="contactNumber"
                  label="Telefone"
                  defaultValue=""
                  style={{ width: '50%' }}
                  maxLength={15}
                  mask={(s: string): string =>
                    `${s
                      .replace(/\D/g, '')
                      .replace(/(\d{2})(\d)/, '($1) $2')
                      .replace(/(\d{5})(\d)/, '$1-$2')
                      .replace(/(-\d{4})\d+?$/, '$1')}`
                  }
                />
              </AuxDataSecond>

              <SectionDivider>Dados Profissionais</SectionDivider>
              <ProfessionalData>
                <ControlledInput
                  name="profession"
                  label="Profissão"
                  rules={{
                    required: {
                      value: true,
                      message: 'A profissão é obrigatória',
                    },
                  }}
                />
                <ControlledInput
                  name="registry"
                  label="Registro"
                  rules={{
                    required: {
                      value: true,
                      message: 'O registro profissional é obrigatório',
                    },
                  }}
                />
                <ControlledInput name="specialization" label="Especialização" />
              </ProfessionalData>
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
