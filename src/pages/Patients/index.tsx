import React, { useEffect, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import AlterTopToolbar from '../../components/AlterTopToolbar';
import { api } from '../../service';
import { Column, Patient } from '../../types';
import { BoxHeader, Container, Content, CustomBox, PageTitle } from './styles';
import PatientsTable from './table';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

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

  useEffect(() => {
    (async () => {
      const res = await api.get('patients');

      setPatients(res.data);
    })();
  }, []);

  return (
    <Container>
      <AlterTopToolbar />
      <Content>
        <CustomBox>
          <BoxHeader>
            <PageTitle>Lista de Pacientes</PageTitle>
          </BoxHeader>
          <PatientsTable patients={patients} columns={columns} />
        </CustomBox>
      </Content>
    </Container>
  );
};

export default Patients;
