import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { isAfter, isValid } from 'date-fns';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import AlterTopToolbar from '@components/AlterTopToolbar';
import AsyncInput from '@components/AsyncInput';
import ControlledDatePicker from '@components/ControlledDatePicker';
import ControlledInput from '@components/ControlledInput';
import SectionDivider from '@components/SectionDivider';
import SimpleInput from '@components/SimpleInput';
import { FormAddress } from '@models/Address';
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
  StyledForm,
} from './styles';
import { showAlert } from '@utils/showAlert';
import { CepInfos } from '@interfaces/CepInfos';
import { useEmployees } from '@contexts/Employees';
import { Employee, FormEmployee } from '@models/Employee';

type FormProps = {
  name: string;
  email: string;
  birthDate: Date;
  CPF: string;
  contactNumber: string;
  address?: FormAddress;
  userName: string;
  password?: string;
};

const EmployeesForm = (): JSX.Element => {
  const { state }: { state: Employee } = useLocation() as {
    state: Employee;
  };
  const [employeeToEdit] = useState<Employee>(state);

  const formMethods = useForm({
    defaultValues: employeeToEdit && {
      id: employeeToEdit.id,
      name: employeeToEdit.name,
      email: employeeToEdit?.email || '',
      CPF: employeeToEdit?.CPF || '',
      birthDate: new Date(
        employeeToEdit.birthDate.split('/').reverse().join('-') + 'GMT-0300'
      ),
      contactNumber: employeeToEdit?.contactNumber || '',
      userName: employeeToEdit?.userName || '',
      address: {
        zipCode: employeeToEdit?.address?.zipCode || '',
      },
    },
  });
  const { handleSubmit, reset } = formMethods;
  const { create } = useEmployees();
  const navigate = useNavigate();
  const [inputLoading, setInputLoading] = useState<boolean>(false);
  const [cepInfos, setCepInfos] = useState<CepInfos | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (employeeToEdit && employeeToEdit.address) {
      setCepInfos({
        cep: employeeToEdit.address.zipCode,
        localidade: employeeToEdit.address.city,
        logradouro: employeeToEdit.address.publicArea,
        bairro: employeeToEdit.address.district,
        uf: employeeToEdit.address.state,
      });
    }
  }, []);

  const onSubmit = async (data: FieldValues): Promise<void> => {
    const formData: FormProps = data as FormProps;

    const employee: FormEmployee = {
      ...(employeeToEdit && employeeToEdit?.id && { id: employeeToEdit.id }),
      userName: formData.userName,
      password: formData.password || '',
      name: formData.name,
      email: formData.email || '',
      CPF: formData.CPF || '',
      birthDate: formData.birthDate
        ? formData.birthDate.toISOString().split('T')[0]
        : '',
      contactNumber: formData.contactNumber || '',
      ...(formData.address?.zipCode && {
        address: {
          zipCode: formData.address.zipCode,
          city: cepInfos?.localidade || '',
          state: cepInfos?.uf || '',
          publicArea: formData.address.publicArea || cepInfos?.logradouro || '',
          district: formData.address.district || cepInfos?.bairro || '',
          ...(employeeToEdit?.address?.id && {
            id: employeeToEdit.address.id,
          }),
        },
      }),
    };

    setLoading(true);
    try {
      const { content, message } = await create(employee);
      showAlert({
        title: 'Sucesso!',
        text: `${message} Código de acesso: ${content?.accessCode}`,
        icon: 'success',
      });
      if (!employeeToEdit) {
        reset();
        setCepInfos(undefined);
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

  return (
    <Container>
      <AlterTopToolbar />
      <Content>
        <CustomBox>
          <div>
            <BoxHeader>
              <PageTitle>Criar Funcionário</PageTitle>
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
                        message: 'O nome do funcionário é obrigatório',
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
                      required: {
                        value: true,
                        message: 'O CPF do funcionário é obrigatório',
                      },
                    }}
                    required
                  />
                  <ControlledDatePicker
                    name="birthDate"
                    required
                    rules={{
                      required: {
                        value: true,
                        message:
                          'A data de nascimento do funcionário é obrigatória',
                      },
                      validate: (date) => {
                        if (!isValid(date))
                          return 'A data escolhida é inválida';

                        return (
                          !isAfter(date, new Date()) ||
                          'A Data escolhida não pode ser superior à data atual'
                        );
                      },
                    }}
                    label="Data de nascimento"
                    defaultValue={new Date()}
                  />
                  <ControlledInput
                    rules={{
                      required: {
                        value: true,
                        message: 'O nome de usuário é obrigatório',
                      },
                    }}
                    name="userName"
                    label="Nome de usuário"
                    required
                  />
                  {!employeeToEdit && (
                    <ControlledInput
                      rules={{
                        required: {
                          value: true,
                          message: 'A senha é obrigatória',
                        },
                      }}
                      type="password"
                      endFunction="password"
                      name="password"
                      label="Senha"
                      required
                    />
                  )}
                </PersonalDataSecond>

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
              onClick={() => navigate('/employees', { replace: true })}
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

export default React.memo(EmployeesForm);
