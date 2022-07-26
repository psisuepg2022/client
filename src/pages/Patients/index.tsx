import React, { useEffect, useState } from 'react';
import { FormControl, IconButton, SelectChangeEvent, Tooltip } from '@mui/material';
import AlterTopToolbar from '../../components/AlterTopToolbar';
import { api } from '../../service';
import { Column, Patient } from '../../types';
import { BoxHeader, Container, Content, CustomBox, PageTitle, LogoContainer, StyledButton, TitleAndInputs, ButtonsContainer, InputsForm, StyledSelect, StyledMenuItem, StyledInputLabel } from './styles';
import PatientsTable from './table';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import logoPSIS from '../../assets/PSIS-Logo-Invertido-Transparente.png';
import CircularProgressWithContent from '../../components/CircularProgressWithContent';
import ControlledInput from '../../components/ControlledInput';
import { FormProvider, useForm } from 'react-hook-form';
import ControlledSelect from '../../components/ControlledSelect';

const columns: Column[] = [
  {
    id: 0,
    label: 'Nome',
  },
  {
    id: 1,
    label: 'CPF',
    tooltip: 
      <Tooltip title="Caso o paciente não possua CPF próprio, o CPF do responsável será apresentado nesta coluna.">
        <IconButton size="small">
          <AiOutlineQuestionCircle />
        </IconButton>
      </Tooltip>
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

const Patients = (): JSX.Element => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>('Nome');
  const formMethods = useForm();

  useEffect(() => {
    (async () => {
      const res = await api.get('patients');

      setPatients(res.data);
      setLoading(false);
    })();
  }, []);

  return (
    <Container>
      <AlterTopToolbar />
      <Content>
        {
          loading
            ? <CircularProgressWithContent
                content={<LogoContainer src={logoPSIS} />}
                size={200}
              />
            : <CustomBox>
                <BoxHeader>
                  <TitleAndInputs>
                    <PageTitle>Lista de Pacientes</PageTitle>
                    <FormProvider {...formMethods}>
                      <InputsForm>
                        <ControlledInput 
                          name="filter"
                          label={category}
                          size="medium"
                        />
                        <FormControl>
                          <StyledInputLabel>Categoria</StyledInputLabel>
                          <StyledSelect
                            name="category"
                            label="Categoria"
                            notched
                            defaultValue={'name'}
                            onChange={(e: SelectChangeEvent<unknown>) =>
                              setCategory(e.target.value as string)
                            }
                            value={category}
                          >
                            <StyledMenuItem value='Nome'>Nome</StyledMenuItem>
                            <StyledMenuItem value='CPF'>CPF</StyledMenuItem>
                            <StyledMenuItem value='Email'>Email</StyledMenuItem>
                          </StyledSelect>
                        </FormControl>
                      </InputsForm>
                    </FormProvider>
                  </TitleAndInputs>
                  <ButtonsContainer>
                    <StyledButton>ADICIONAR</StyledButton>
                    <StyledButton>BUSCAR</StyledButton>
                  </ButtonsContainer>
                </BoxHeader>
                <PatientsTable patients={patients} columns={columns} />
              </CustomBox>
        }
 
      </Content>
    </Container>
  );
};

export default Patients;
