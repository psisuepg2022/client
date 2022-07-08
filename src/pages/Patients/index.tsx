import React, { useEffect, useState } from 'react';
import AlterTopToolbar from '../../components/AlterTopToolbar';
import { api } from '../../service';
import { Column, Patient } from '../../types';
import { BoxHeader, Container, Content, CustomBox, PageTitle } from './styles';
import PatientsTable from './table';

const columns: Column[] = [
  {
    id: 0,
    label: 'Nome',
  },
  {
    id: 1,
    label: 'Email',
  },
  {
    id: 2,
    label: 'Telefone',
  },
  {
    id: 3,
    label: 'Data de nascimento',
  },
  {
    id: 4,
    label: 'CPF',
  },
  {
    id: 5,
    label: 'Estado civil',
  },
  {
    id: 6,
    label: 'Sexo',
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
