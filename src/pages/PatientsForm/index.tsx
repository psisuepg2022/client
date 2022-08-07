import React, { useEffect, useState } from 'react';
import { CircularProgress, FormControlLabel } from '@mui/material';
import { isAfter } from 'date-fns';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import AlterTopToolbar from '../../components/AlterTopToolbar';
import AsyncInput from '../../components/AsyncInput';
import ControlledDatePicker from '../../components/ControlledDatePicker';
import ControlledInput from '../../components/ControlledInput';
import ControlledSelect from '../../components/ControlledSelect';
import SectionDivider from '../../components/SectionDivider';
import SimpleInput from '../../components/SimpleInput';
import {
  Address,
  CepInfos,
  FormPatient,
  Gender,
  MartitalStatus,
  Patient,
  Person,
  Response,
} from '../../interfaces';
import { searchForCep } from '../../utils/zipCode';
import {
  AuxDataFirst,
  AuxDataSecond,
  BoxHeader,
  ButtonsContainer,
  Container,
  Content,
  CustomBox,
  CustomTextField,
  PageTitle,
  PersonalDataFirst,
  PersonalDataSecond,
  StyledButton,
  StyledButtonInverted,
  StyledCheckbox,
  StyledForm,
  StyledMenuItem,
} from './styles';
import { showAlert } from '../../utils/showAlert';
import ControlledAutocompleteInput from '../../components/ControlledAutocompleteInput';
import { api } from '../../service';
import SimpleDatePicker from '../../components/SimpleDatePicker';
import { usePatients } from '../../contexts/Patients';

type FormProps = {
  name: string;
  email: string;
  birthDate: Date;
  gender: number;
  maritalStatus: number;
  CPF: string;
  contactNumber: string;
  address?: Address;
  liable?: {
    name: string;
    CPF: string;
    email?: string;
    birthDate: Date;
  };
};

const PatientsForm = (): JSX.Element => {
  const { state }: { state: Patient } = useLocation() as { state: Patient };
  const formMethods = useForm({
    defaultValues: state && {
      name: state.name,
      email: state?.email || '',
      CPF: state?.CPF || '',
      birthDate: new Date(
        state.birthDate.split('/').reverse().join('-') + 'GMT-0300'
      ),
      maritalStatus:
        MartitalStatus[state.maritalStatus as keyof typeof MartitalStatus],
      gender: Gender[state.gender as keyof typeof Gender],
      liable: {
        name: state?.liable?.name || '',
        email: state?.liable?.email || '',
        CPF: state?.liable?.CPF || '',
        birthDate:
          state.liable &&
          (new Date(
            (state?.liable?.birthDate
              .split('/')
              .reverse()
              .join('-') as string) + 'GMT-0300'
          ) ||
            new Date()),
      },
      contactNumber: state?.contactNumber || '',
      zipCode: state?.address?.zipCode || '',
    },
  });
  const { handleSubmit, reset } = formMethods;
  const { create } = usePatients();
  const navigate = useNavigate();
  const [needLiable, setNeedLiable] = useState<boolean>(false);
  const [inputLoading, setInputLoading] = useState<boolean>(false);
  const [cepInfos, setCepInfos] = useState<CepInfos | undefined>(undefined);
  const [existingLiable, setExistingLiable] = useState<Person | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (state) {
      state.liable && setNeedLiable(true);

      if (state.address) {
        setCepInfos({
          cep: state.address.zipCode,
          localidade: state.address.city,
          logradouro: state.address.publicArea,
          bairro: state.address.district,
          uf: state.address.state,
        });
      }
    }
  }, []);

  const onSubmit = async (data: FieldValues): Promise<void> => {
    const formData: FormProps = data as FormProps;

    const patient: FormPatient = {
      name: formData.name,
      email: formData.email || '',
      CPF: formData.CPF || '',
      birthDate: formData.birthDate
        ? formData.birthDate.toISOString().split('T')[0]
        : '',
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      contactNumber: formData.contactNumber || '',
      liable:
        formData.liable && needLiable
          ? {
              name: formData.liable.name,
              CPF: formData.liable.CPF,
              email: formData.liable.email || '',
              birthDate: formData.liable.birthDate.toISOString().split('T')[0],
              contactNumber: formData.contactNumber || '',
            }
          : undefined,
      liableRequired: needLiable,
    };

    const withAddress = formData.address?.zipCode && {
      ...patient,
      address: {
        zipCode: formData.address.zipCode,
        city: cepInfos?.localidade || '',
        state: cepInfos?.uf || '',
        publicArea: formData.address.publicArea || cepInfos?.logradouro || '',
        district: formData.address.district || cepInfos?.bairro || '',
      },
    };

    setLoading(true);
    try {
      const response = await create(withAddress || patient);
      showAlert({
        text: response.message,
        icon: 'success',
      });
      reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        text: e.response.data.message || 'Ocorreu um problema inesperado',
        icon: 'error',
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

  const handleSearchLiable = async (value: string): Promise<Person[]> => {
    const {
      data,
    }: { data: Response<{ items: Person[]; totalItems: number }> } =
      await api.post('/patient/search_liable', {
        name: value,
      });

    if (data.content?.items && data.content.items.length > 0)
      return [
        {
          birthDate: new Date().toISOString().split('T')[0],
          id: '',
          name: value,
          CPF: '',
          email: '',
        },
        ...data.content.items,
      ];

    return [
      {
        birthDate: new Date().toISOString().split('T')[0],
        id: '',
        name: value,
        CPF: '',
        email: '',
      },
    ] as Person[];
  };

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
              <StyledForm
                id="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <SectionDivider>Dados Pessoais</SectionDivider>
                <PersonalDataFirst>
                  <ControlledInput
                    rules={{
                      required: {
                        value: true,
                        message: 'O nome do paciente é obrigatório',
                      },
                    }}
                    name="name"
                    label="Nome"
                    required
                  />
                  <ControlledInput name="email" label="Email" />
                </PersonalDataFirst>
                <PersonalDataSecond>
                  <ControlledInput
                    name="CPF"
                    label="CPF"
                    maxLength={14}
                    mask={(s: string): string =>
                      `${s
                        .replace(/\D/g, '')
                        .replace(/(\d{3})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d)/, '$1-$2')
                        .replace(/(-\d{2})\d+?$/, '$1')}`
                    }
                    rules={{
                      maxLength: {
                        value: 14,
                        message: 'Insira um CPF válido',
                      },
                      minLength: {
                        value: 14,
                        message: 'Insira um CPF válido',
                      },
                      validate: (value) =>
                        !(!value && !needLiable) ||
                        'Caso o paciente não possua CPF é necessário cadastrar um responsável com CPF válido',
                    }}
                    required={!needLiable}
                  />
                  <ControlledDatePicker
                    name="birthDate"
                    rules={{
                      required: {
                        value: true,
                        message:
                          'A data de nascimento do paciente é obrigatória',
                      },
                      validate: (date) =>
                        !isAfter(date, new Date()) ||
                        'A Data escolhida não pode ser superior à data atual',
                    }}
                    label="Data de nascimento"
                    defaultValue={new Date()}
                  />
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
                    <StyledMenuItem value={3}>Transgênero</StyledMenuItem>
                    <StyledMenuItem value={4}>Não-binário</StyledMenuItem>
                    <StyledMenuItem value={5}>Prefiro não dizer</StyledMenuItem>
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
                      <ControlledAutocompleteInput
                        name="liable.name"
                        label="Nome"
                        callback={(value: string) => handleSearchLiable(value)}
                        noOptionsText="Não foram encontrados responsáveis cadastrados"
                        selectCallback={(person: Person) => {
                          console.log('SELECT', person);
                          if (person.id) setExistingLiable(person);
                        }}
                        cleanseAfterSelect={() => setExistingLiable(undefined)}
                        required
                        rules={{
                          required: {
                            value: true,
                            message: 'O nome do responsável é obrigatório',
                          },
                        }}
                      />
                      {existingLiable ? (
                        <SimpleInput
                          name="liable.email"
                          label="Email"
                          contentEditable={false}
                          value={existingLiable?.email || ''}
                        />
                      ) : (
                        <ControlledInput name="liable.email" label="Email" />
                      )}
                    </PersonalDataFirst>
                    <PersonalDataSecond>
                      {existingLiable ? (
                        <SimpleInput
                          name="liable.CPF"
                          label="CPF"
                          contentEditable={false}
                          value={existingLiable.CPF || ''}
                          mask={(s: string): string =>
                            `${s
                              .replace(/\D/g, '')
                              .replace(/(\d{3})(\d)/, '$1.$2')
                              .replace(/(\d{3})(\d)/, '$1.$2')
                              .replace(/(\d{3})(\d)/, '$1-$2')
                              .replace(/(-\d{2})\d+?$/, '$1')}`
                          }
                          required
                        />
                      ) : (
                        <ControlledInput
                          name="liable.CPF"
                          label="CPF"
                          rules={{
                            maxLength: {
                              value: 14,
                              message: 'Insira um CPF válido',
                            },
                            minLength: {
                              value: 14,
                              message: 'Insira um CPF válido',
                            },
                            required: {
                              value: true,
                              message: 'O CPF do responsável é obrigatório',
                            },
                          }}
                          maxLength={14}
                          mask={(s: string): string =>
                            `${s
                              .replace(/\D/g, '')
                              .replace(/(\d{3})(\d)/, '$1.$2')
                              .replace(/(\d{3})(\d)/, '$1.$2')
                              .replace(/(\d{3})(\d)/, '$1-$2')
                              .replace(/(-\d{2})\d+?$/, '$1')}`
                          }
                          required
                        />
                      )}

                      {existingLiable ? (
                        <SimpleDatePicker
                          name="liable.birthDate"
                          label="Data de nascimento"
                          value={
                            new Date(
                              existingLiable.birthDate
                                .split('/')
                                .reverse()
                                .join('-') + 'GMT-0300'
                            )
                          }
                          onChange={() => null}
                          renderInput={(params) => (
                            <CustomTextField
                              {...params}
                              contentEditable={false}
                            />
                          )}
                        />
                      ) : (
                        <ControlledDatePicker
                          name="liable.birthDate"
                          label="Data de nascimento"
                          defaultValue={new Date()}
                          rules={{
                            required: {
                              value: true,
                              message:
                                'A data de nascimento do paciente é obrigatória',
                            },
                            validate: (date) =>
                              !isAfter(date, new Date()) ||
                              'A Data escolhida não pode ser superior à data atual',
                          }}
                        />
                      )}
                    </PersonalDataSecond>
                  </>
                )}

                <SectionDivider>Dados Auxiliares</SectionDivider>
                <AuxDataFirst>
                  <AsyncInput
                    name="address.zipCode"
                    label="CEP"
                    onCompleteCep={handleCepComplete}
                    inputLoading={inputLoading}
                    defaultValue=""
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
              </StyledForm>
            </FormProvider>
          </div>

          <ButtonsContainer>
            <StyledButton
              type="submit"
              form="form"
              style={{ gridColumnStart: 3 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={20} style={{ color: '#FFF' }} />
              ) : (
                'SALVAR'
              )}
            </StyledButton>
            <StyledButtonInverted
              disabled={loading}
              onClick={() => navigate('/patients', { replace: true })}
              style={{ gridColumnStart: 4 }}
            >
              CANCELAR
            </StyledButtonInverted>
          </ButtonsContainer>
        </CustomBox>
      </Content>
    </Container>
  );
};

export default PatientsForm;
