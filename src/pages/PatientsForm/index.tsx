import React, { useEffect, useState } from 'react';
import { CircularProgress, FormControlLabel } from '@mui/material';
import { isAfter, isEqual, isValid } from 'date-fns';
import { FieldValues, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import AlterTopToolbar from '@components/AlterTopToolbar';
import AsyncInput from '@components/AsyncInput';
import ControlledDatePicker from '@components/ControlledDatePicker';
import ControlledInput from '@components/ControlledInput';
import ControlledSelect from '@components/ControlledSelect';
import SectionDivider from '@components/SectionDivider';
import SimpleInput from '@components/SimpleInput';
import { FormAddress } from '@models/Address';
import { FormPatient, Patient } from '@models/Patient';
import { Person } from '@models/Person';
import { Response } from '@interfaces/Response';
import { searchForCep } from '@utils/zipCode';
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
import { showAlert } from '@utils/showAlert';
import ControlledAutocompleteInput from '@components/ControlledAutocompleteInput';
import { api } from '@service/index';
import { usePatients } from '@contexts/Patients';
import { MartitalStatus } from '@interfaces/MaritalStatus';
import { Gender } from '@interfaces/Gender';
import { CepInfos } from '@interfaces/CepInfos';
import { showToast } from '@utils/showToast';

type FormProps = {
  name: string;
  email: string;
  birthDate: Date;
  gender: number;
  maritalStatus: number;
  CPF: string;
  contactNumber: string;
  address?: FormAddress;
  liable?: {
    id?: string;
    name: string;
    CPF: string;
    email?: string;
    birthDate: Date | string;
  };
};

const PatientsForm = (): JSX.Element => {
  const { state }: { state: Patient } = useLocation() as { state: Patient };
  const [patientToEdit] = useState<Patient>(state);
  const formMethods = useForm({
    defaultValues: patientToEdit && {
      id: patientToEdit.id,
      name: patientToEdit.name,
      email: patientToEdit?.email || '',
      CPF: patientToEdit?.CPF || '',
      birthDate: new Date(
        patientToEdit.birthDate.split('/').reverse().join('-') + 'GMT-0300'
      ),
      maritalStatus:
        MartitalStatus[
          patientToEdit.maritalStatus as keyof typeof MartitalStatus
        ],
      gender: Gender[patientToEdit.gender as keyof typeof Gender],
      liable: {
        id: patientToEdit?.liable?.id || '',
        name: patientToEdit?.liable?.name || '',
        email: patientToEdit?.liable?.email || '',
        CPF: patientToEdit?.liable?.CPF || '',
        birthDate:
          patientToEdit.liable &&
          (new Date(
            (patientToEdit?.liable?.birthDate
              .split('/')
              .reverse()
              .join('-') as string) + 'GMT-0300'
          ) ||
            new Date()),
      },
      contactNumber: patientToEdit?.contactNumber || '',
      address: {
        zipCode: patientToEdit?.address?.zipCode || '',
      },
    },
  });
  const { handleSubmit, reset, setValue, control } = formMethods;
  const { create } = usePatients();
  const navigate = useNavigate();
  const [needLiable, setNeedLiable] = useState<boolean>(false);
  const [inputLoading, setInputLoading] = useState<boolean>(false);
  const [cepInfos, setCepInfos] = useState<CepInfos | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const { liable } = useWatch({ control });

  useEffect(() => {
    if (patientToEdit) {
      patientToEdit.liable && setNeedLiable(true);

      if (patientToEdit.address) {
        setCepInfos({
          cep: patientToEdit.address.zipCode,
          localidade: patientToEdit.address.city,
          logradouro: patientToEdit.address.publicArea,
          bairro: patientToEdit.address.district,
          uf: patientToEdit.address.state,
        });
      }
    }
  }, []);

  const onSubmit = async (data: FieldValues): Promise<void> => {
    const formData: FormProps = data as FormProps;

    const patient: FormPatient = {
      ...(patientToEdit && patientToEdit?.id && { id: patientToEdit.id }),
      name: formData.name,
      email: formData.email || '',
      CPF: formData.CPF || '',
      birthDate: formData.birthDate
        ? formData.birthDate.toISOString().split('T')[0]
        : '',
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      contactNumber: formData.contactNumber || '',
      ...(formData.liable &&
        formData.liable.CPF &&
        needLiable && {
          liable: {
            ...(formData.liable?.id && { id: formData.liable.id }),
            name: formData.liable.name,
            CPF: formData.liable.CPF,
            email: formData.liable.email || '',
            birthDate:
              typeof formData.liable.birthDate === 'string'
                ? formData.liable.birthDate
                : formData.liable.birthDate.toISOString().split('T')[0],
            contactNumber: formData.contactNumber || '',
          },
        }),
      liableRequired: needLiable,
      ...(formData.address?.zipCode && {
        address: {
          zipCode: formData.address.zipCode,
          city: cepInfos?.localidade || '',
          state: cepInfos?.uf || '',
          publicArea: formData.address.publicArea || cepInfos?.logradouro || '',
          district: formData.address.district || cepInfos?.bairro || '',
          ...(patientToEdit?.address?.id && { id: patientToEdit.address.id }),
        },
      }),
    };

    setLoading(true);
    try {
      const { message } = await create(patient);

      showToast({
        text: message,
      });

      if (!patientToEdit) {
        reset();
        setCepInfos(undefined);
        setNeedLiable(false);
      } else {
        reset();
        setCepInfos(undefined);
        setNeedLiable(false);
        navigate('/patients');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        text: e?.response?.data?.message || 'Ocorreu um problema inesperado',
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
      await api.post('patient/search_liable', {
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
              <PageTitle>
                {state ? 'Editar Paciente' : 'Criar Paciente'}
              </PageTitle>
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
                    required
                    rules={{
                      required: {
                        value: true,
                        message:
                          'A data de nascimento do paciente é obrigatória',
                      },
                      validate: (date: Date) => {
                        if (!isValid(date))
                          return 'A data escolhida é inválida';

                        date.setHours(0, 0, 0);
                        const currenDate = new Date();
                        currenDate.setHours(0, 0, 0);

                        return (
                          !isAfter(date, currenDate) ||
                          isEqual(date, currenDate) ||
                          'A Data escolhida não pode ser superior ou igual à data atual'
                        );
                      },
                    }}
                    label="Data de nascimento"
                    defaultValue={new Date()}
                  />
                  <ControlledSelect
                    defaultValue={''}
                    name="maritalStatus"
                    label="Estado civil"
                    rules={{
                      required: {
                        value: true,
                        message: 'O estado civil é obrigatório',
                      },
                    }}
                    required
                  >
                    <StyledMenuItem value={1}>Casado(a)</StyledMenuItem>
                    <StyledMenuItem value={2}>Divorciado(a)</StyledMenuItem>
                    <StyledMenuItem value={3}>Solteiro(a)</StyledMenuItem>
                    <StyledMenuItem value={4}>Viúvo(a)</StyledMenuItem>
                  </ControlledSelect>
                  <ControlledSelect
                    defaultValue={''}
                    name="gender"
                    label="Gênero"
                    required
                    rules={{
                      required: {
                        value: true,
                        message: 'O gênero é obrigatório',
                      },
                    }}
                  >
                    <StyledMenuItem value={1}>Feminino</StyledMenuItem>
                    <StyledMenuItem value={2}>Masculino</StyledMenuItem>
                    <StyledMenuItem value={3}>Não binário</StyledMenuItem>
                    <StyledMenuItem value={4}>Prefiro não dizer</StyledMenuItem>
                    <StyledMenuItem value={5}>Transgênero</StyledMenuItem>
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
                        defaultValue={liable && liable?.name}
                        callback={(value: string) => handleSearchLiable(value)}
                        noOptionsText="Não foram encontrados responsáveis cadastrados"
                        selectCallback={(person: Person) => {
                          if (person) {
                            setValue('liable.id', person.id || '');
                            setValue('liable.name', person.name);
                            setValue('liable.email', person.email || '');
                            setValue('liable.CPF', person.CPF || '');
                            setValue(
                              'liable.birthDate',
                              new Date(
                                (person.birthDate
                                  .split('/')
                                  .reverse()
                                  .join('-') as string) + 'GMT-0300'
                              )
                            );
                          } else {
                            setValue('liable.id', '');
                            setValue('liable.name', '');
                            setValue('liable.email', '');
                            setValue('liable.CPF', '');
                            setValue('liable.birthDate', new Date());
                          }
                        }}
                        required
                        rules={{
                          required: {
                            value: true,
                            message: 'O nome do responsável é obrigatório',
                          },
                        }}
                      />
                      <ControlledInput name="liable.email" label="Email" />
                    </PersonalDataFirst>
                    <PersonalDataSecond>
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
                      <ControlledDatePicker
                        name="liable.birthDate"
                        label="Data de nascimento"
                        required
                        defaultValue={new Date()}
                        rules={{
                          required: {
                            value: true,
                            message:
                              'A data de nascimento do responsável é obrigatória',
                          },
                          validate: (date) => {
                            if (!isValid(date))
                              return 'A data escolhida é inválida';

                            date.setHours(0, 0, 0);
                            const currenDate = new Date();
                            currenDate.setHours(0, 0, 0);

                            return (
                              !isAfter(date, currenDate) ||
                              isEqual(date, currenDate) ||
                              'A Data escolhida não pode ser superior ou igual à data atual'
                            );
                          },
                        }}
                      />
                      {/* )} */}
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
                    defaultValue={''}
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

export default React.memo(PatientsForm);
