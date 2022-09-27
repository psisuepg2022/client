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
import { useAuth } from '@contexts/Auth';
import { useOwner } from '@contexts/Owner';
import { dateFormat } from '@utils/dateFormat';
import { Address } from '@models/Address';
import { CepInfos } from '@interfaces/CepInfos';
import { searchForCep } from '@utils/zipCode';
import AsyncInput from '@components/AsyncInput';
import SimpleInput from '@components/SimpleInput';

type ProfileFormProps = {
  clinic: {
    name: string;
    email: string;
  };
  name: string;
  email?: string;
  birthDate: Date;
  CPF: string;
  contactNumber?: string;
  address?: Address;
};

const OwnerProfile = (): JSX.Element => {
  const {
    user: { clinic },
  } = useAuth();
  const formMethods = useForm<ProfileFormProps>({
    defaultValues: {
      clinic: {
        email: clinic?.email,
        name: clinic?.name,
      },
    },
  });
  const { getProfile, updateProfile } = useOwner();
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

        const [day, month, year] = (content?.birthDate as string).split('/');
        const birthDate = new Date(
          Number(year),
          Number(month) - 1,
          Number(day)
        );

        setValue('name', content?.name || '');
        setValue('email', content?.email || '');
        setValue('CPF', content?.CPF || '');
        setValue('birthDate', birthDate || new Date());
        setValue('contactNumber', content?.contactNumber || '');

        if (content?.address) {
          setValue('address.id', content.address?.id);
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

  const onSubmit = async (data: FieldValues): Promise<void> => {
    const formData: ProfileFormProps = data as ProfileFormProps;

    const birthDateAltered = dateFormat({
      date: formData.birthDate,
      stringFormat: 'yyyy-MM-dd',
    });

    const owner = {
      ...formData,
      clinic: {
        ...formData.clinic,
        id: clinic?.id as string,
      },
      birthDate: birthDateAltered,
      ...(formData.address?.zipCode && {
        address: {
          id: formData.address.id,
          zipCode: formData.address.zipCode,
          city: cepInfos?.localidade || '',
          state: cepInfos?.uf || '',
          publicArea: formData.address.publicArea || cepInfos?.logradouro || '',
          district: formData.address.district || cepInfos?.bairro || '',
        },
      }),
    };

    try {
      setLoading(true);
      await updateProfile(owner);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        icon: 'error',
        text:
          e?.response?.data?.message ||
          'Ocorreu um problema ao atualizar o perfil',
      });
    } finally {
      setLoading(false);
    }
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
                    name="birthDate"
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

export default OwnerProfile;
