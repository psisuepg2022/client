import React, { useEffect, useState } from 'react';
import {
  FormControl,
  IconButton,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import AlterTopToolbar from '../../components/AlterTopToolbar';
import { api } from '../../service';
import { Column, Patient } from '../../interfaces';
import {
  BoxHeader,
  Container,
  Content,
  CustomBox,
  PageTitle,
  LogoContainer,
  StyledButton,
  TitleAndInputs,
  ButtonsContainer,
  InputsForm,
  StyledSelect,
  StyledMenuItem,
  StyledInputLabel,
} from './styles';
import PatientsTable from './table';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import logoPSIS from '../../assets/PSIS-Logo-Invertido-Transparente.png';
import CircularProgressWithContent from '../../components/CircularProgressWithContent';
import ControlledInput from '../../components/ControlledInput';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '../../contexts/Patients';

const columns: Column[] = [
  {
    id: 0,
    label: 'Nome',
  },
  {
    id: 1,
    label: 'CPF',
    tooltip: (
      <Tooltip title="Caso o paciente não possua CPF próprio, o CPF do responsável será apresentado nesta coluna.">
        <IconButton size="small">
          <AiOutlineQuestionCircle />
        </IconButton>
      </Tooltip>
    ),
  },
  {
    id: 2,
    label: 'Data de nascimento',
  },
  {
    id: 3,
    label: 'Telefone',
  },
  {
    id: 4,
    label: 'Ações',
  },
];

type SearchProps = {
  CPF?: string;
  Nome?: string;
  Email?: string;
};

const Patients = (): JSX.Element => {
  const { patients, list, count } = usePatients();
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>('Nome');
  const formMethods = useForm();
  const { handleSubmit, reset } = formMethods;
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await list();
      } catch (e: any) {
      } finally {
        setLoading(false);
        console.log('pt', patients);
      }
    })();
  }, []);

  const onSubmit = (data: FieldValues): void => {
    const searchData: SearchProps = data as SearchProps;
    console.log('DATA', searchData);
  };

  const getSearchInput = (): JSX.Element => {
    if (category === 'Email') {
      return <ControlledInput name={category} label={category} size="medium" />;
    }

    if (category === 'CPF') {
      return (
        <ControlledInput
          name={category}
          label={category}
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
        />
      );
    }

    return <ControlledInput name={category} label={category} size="medium" />;
  };

  return (
    <Container>
      <AlterTopToolbar />
      <Content>
        {loading ? (
          <CircularProgressWithContent
            content={<LogoContainer src={logoPSIS} />}
            size={200}
          />
        ) : (
          <CustomBox>
            <BoxHeader>
              <TitleAndInputs>
                <PageTitle>Lista de Pacientes</PageTitle>
                <FormProvider {...formMethods}>
                  <InputsForm id="search" onSubmit={handleSubmit(onSubmit)}>
                    {getSearchInput()}
                    <FormControl>
                      <StyledInputLabel>Categoria</StyledInputLabel>
                      <StyledSelect
                        name="category"
                        label="Categoria"
                        notched
                        defaultValue="Nome"
                        onChange={(e: SelectChangeEvent<unknown>) => {
                          setCategory(e.target.value as string);
                          reset();
                        }}
                        value={category}
                      >
                        <StyledMenuItem value="Nome">Nome</StyledMenuItem>
                        <StyledMenuItem value="CPF">CPF</StyledMenuItem>
                        <StyledMenuItem value="Email">Email</StyledMenuItem>
                      </StyledSelect>
                    </FormControl>
                  </InputsForm>
                </FormProvider>
              </TitleAndInputs>
              <ButtonsContainer>
                <StyledButton onClick={() => navigate('/patients/form')}>
                  ADICIONAR
                </StyledButton>
                <StyledButton form="search" type="submit">
                  BUSCAR
                </StyledButton>
              </ButtonsContainer>
            </BoxHeader>
            <PatientsTable
              patients={patients}
              columns={columns}
              count={count}
            />
          </CustomBox>
        )}
      </Content>
    </Container>
  );
};

export default Patients;
