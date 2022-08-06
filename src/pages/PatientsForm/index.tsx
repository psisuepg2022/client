import React, { useEffect, useState } from 'react';
import { FormControlLabel } from '@mui/material';
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
  CepInfos,
  Gender,
  MartitalStatus,
  Patient,
  Person,
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

type FormProps = {
  name: string;
  email: string;
  birthDate: string;
  gender: number;
  maritalStatus: number;
  CPF: string;
  contactNumber: string;
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
  const { handleSubmit } = formMethods;
  const [needLiable, setNeedLiable] = useState<boolean>(false);
  const [inputLoading, setInputLoading] = useState<boolean>(false);
  const [cepInfos, setCepInfos] = useState<CepInfos | undefined>(undefined);
  const [existingLiable, setExistingLiable] = useState<Person | undefined>(
    undefined
  );
  const navigate = useNavigate();

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

  const onSubmit = (data: FieldValues): void => {
    const formData: FormProps = data as FormProps;

    console.log('FORM DATA', formData, existingLiable);
  };

  const handleCepComplete = async (value: string): Promise<CepInfos | void> => {
    if (value.length < 10) {
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
    console.log('STRING', value);
    const res = await api.get('/patient');
    console.log('res', res);

    return [
      {
        birthDate: new Date().toISOString().split('T')[0],
        id: '',
        name: value,
        CPF: '',
        email: '',
      },
      {
        birthDate: '23/09/2000',
        id: '12',
        name: 'Renato Cristiano',
        CPF: '000.000.000-00',
        email: 'rcruppel@email.com',
      },
      {
        birthDate: '22/04/1959',
        id: '16',
        name: 'Renato Ruppel',
        CPF: '111.111.000-00',
        email: 'rruppel@email.com',
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
                    name="zipCode"
                    label="CEP"
                    onCompleteCep={handleCepComplete}
                    inputLoading={inputLoading}
                    defaultValue=""
                    maxLength={10}
                    mask={(s: string): string =>
                      `${s
                        .replace(/\D/g, '')
                        .replace(/(\d{2})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d)/, '$1-$2')
                        .replace(/(-\d{3})\d+?$/, '$1')}`
                    }
                  />
                  <SimpleInput
                    name="city"
                    label="Cidade"
                    contentEditable={false}
                    value={cepInfos?.localidade || ''}
                  />
                  {cepInfos?.cep && !cepInfos?.logradouro ? (
                    <ControlledInput
                      name="publicArea"
                      label="Logradouro"
                      rules={{
                        validate: (value) => {
                          console.log('VALUE,', value, cepInfos?.cep);
                          return (
                            (cepInfos?.cep && value !== undefined) ||
                            'O logradouro é obrigatório'
                          );
                        },
                      }}
                    />
                  ) : (
                    <SimpleInput
                      name="publicArea"
                      label="Logradouro"
                      contentEditable={false}
                      value={cepInfos?.logradouro || ''}
                    />
                  )}
                </AuxDataFirst>
                <AuxDataSecond>
                  <SimpleInput
                    name="state"
                    label="Estado"
                    contentEditable={false}
                    value={cepInfos?.uf || ''}
                  />
                  {cepInfos?.cep && !cepInfos.bairro ? (
                    <ControlledInput name="district" label="Bairro" />
                  ) : (
                    <SimpleInput
                      name="district"
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
            >
              SALVAR
            </StyledButton>
            <StyledButtonInverted
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
