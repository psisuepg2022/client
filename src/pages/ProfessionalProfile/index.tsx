import React, { useEffect, useState } from 'react';
import {
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AuxDataFirst,
  AuxDataSecond,
  Box,
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
import { isAfter, isEqual, isValid } from 'date-fns';
import { showAlert } from '@utils/showAlert';
import CircularProgressWithContent from '@components/CircularProgressWithContent';
import logoPSIS from '@assets/PSIS-Logo-Invertido-Transparente.png';
import { useProfessionals } from '@contexts/Professionals';
import { Address } from '@models/Address';
import SimpleInput from '@components/SimpleInput';
import { CepInfos } from '@interfaces/CepInfos';
import AsyncInput from '@components/AsyncInput';
import { searchForCep } from '@utils/zipCode';
import {
  AiOutlineClockCircle,
  AiOutlineQuestionCircle,
  AiOutlineRight,
} from 'react-icons/ai';
import { dateFormat } from '@utils/dateFormat';
import { useAuth } from '@contexts/Auth';
import { showToast } from '@utils/showToast';
import AuxDataHelpModal from '@components/AuxDataHelpModal';

type ProfileFormProps = {
  name: string;
  email?: string;
  birthDate: Date;
  CPF: string;
  contactNumber?: string;
  userName: string;
  profession: string;
  registry: string;
  specialization?: string;
  address?: Address;
};

const ProfessionalProfile = (): JSX.Element => {
  const formMethods = useForm<ProfileFormProps>();
  const {
    setUser,
    user: { name },
  } = useAuth();
  const { getProfile, updateProfile } = useProfessionals();
  const { handleSubmit, setValue } = formMethods;
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [cepInfos, setCepInfos] = useState<CepInfos | undefined>(undefined);
  const [inputLoading, setInputLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [auxDataHelpModal, setAuxDataHelpModal] = useState<boolean>(false);

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
        setValue('profession', content?.profession || '');
        setValue('registry', content?.registry || '');
        setValue('specialization', content?.specialization || '');
        setValue('userName', content?.userName || '');

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
    const { address, ...formRest } = formData;
    const birthDateAltered = dateFormat({
      date: formData.birthDate,
      stringFormat: 'yyyy-MM-dd',
    });

    const professional = {
      ...formRest,
      birthDate: birthDateAltered,
      ...(address?.zipCode && {
        address: {
          id: address.id,
          zipCode: address.zipCode,
          city: cepInfos?.localidade || '',
          state: cepInfos?.uf || '',
          publicArea: address.publicArea || cepInfos?.logradouro || '',
          district: address.district || cepInfos?.bairro || '',
        },
      }),
    };

    try {
      setSaveLoading(true);
      const { message } = await updateProfile(professional);

      setUser((prev) => {
        const newUser = { ...prev, name: formData.name };
        localStorage.setItem('@psis:userData', JSON.stringify(newUser));
        return newUser;
      });

      showToast({
        text: `${message}`,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        icon: 'error',
        text:
          e?.response?.data?.message ||
          'Ocorreu um problema ao atualizar o perfil',
      });
    } finally {
      setSaveLoading(false);
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => navigate(-1)} disabled={saveLoading}>
                <FiChevronLeft
                  style={{ color: colors.TEXT, fontSize: '2.5rem' }}
                />
              </IconButton>
              <Typography fontSize={'2.5rem'}>
                Perfil do Profissional
              </Typography>
              <AiOutlineRight
                size={30}
                style={{ color: '#707070', marginLeft: 10 }}
              />
              <Typography
                fontSize={'2rem'}
                style={{ marginLeft: 10, fontWeight: 400 }}
              >
                {name.split(' ')[0]}
              </Typography>
            </div>
            <Tooltip title="Horários de atendimento">
              <IconButton
                disabled={loading || inputLoading || saveLoading}
                onClick={() => navigate('/profile/professional_schedule')}
              >
                <AiOutlineClockCircle
                  style={{ color: colors.PRIMARY, fontSize: '2.5rem' }}
                />
              </IconButton>
            </Tooltip>
          </Header>

          <FormProvider {...formMethods}>
            <Form id="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <SectionDivider>Dados Pessoais</SectionDivider>

              <PersonalInfo>
                <ControlledInput
                  name="name"
                  label="Nome"
                  required
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
                    required
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
                        message: 'O CPF do profissional é obrigatório',
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
                    required
                    rules={{
                      required: {
                        value: true,
                        message: 'A data de nascimento é obrigatória',
                      },
                      validate: (date) => {
                        if (!isValid(date))
                          return 'A data escolhida é inválida';

                        date.setHours(0, 0, 0, 0);
                        const currenDate = new Date();
                        currenDate.setHours(0, 0, 0, 0);

                        return (
                          (!isAfter(date, currenDate) &&
                            !isEqual(date, currenDate)) ||
                          'A data escolhida não pode ser superior ou igual à data atual'
                        );
                      },
                    }}
                  />
                </PersonalInfoHalf>
                <PersonalInfoHalf>
                  <ControlledInput
                    name="userName"
                    label="Nome de usuário"
                    required
                    rules={{
                      required: {
                        value: true,
                        message: 'O nome de usuário é obrigatório',
                      },
                    }}
                  />
                </PersonalInfoHalf>
              </PersonalInfo>

              {auxDataHelpModal && (
                <AuxDataHelpModal
                  open={auxDataHelpModal}
                  handleClose={() => setAuxDataHelpModal(false)}
                />
              )}
              <SectionDivider
                help={
                  <Tooltip title="Ajuda">
                    <IconButton
                      style={{ marginLeft: 5 }}
                      onClick={() => setAuxDataHelpModal(true)}
                    >
                      <AiOutlineQuestionCircle
                        style={{ color: colors.PRIMARY }}
                      />
                    </IconButton>
                  </Tooltip>
                }
              >
                Dados Auxiliares
              </SectionDivider>
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
                  rules={{
                    maxLength: {
                      value: 15,
                      message: 'Insira um telefone válido',
                    },
                    minLength: {
                      value: 15,
                      message: 'Insira um telefone válido',
                    },
                    required: {
                      value: true,
                      message: 'Um número de telefone é obrigatório',
                    },
                  }}
                  required
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
                  required
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
                  required
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
          <StyledButton
            disabled={saveLoading || inputLoading}
            type="submit"
            form="form"
          >
            {saveLoading ? (
              <CircularProgress size={20} style={{ color: '#FFF' }} />
            ) : (
              'SALVAR'
            )}
          </StyledButton>
        </Content>
      </Box>
    </Container>
  );
};

export default ProfessionalProfile;
