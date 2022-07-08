import React, { useEffect, useState } from 'react';
import AlterTopToolbar from '../../components/AlterTopToolbar';
import { api } from '../../service';
import { Column, Patient } from '../../types';
import { Container, Content, CustomBox } from './styles';
import PatientsTable from './table';

const columns: Column[] = [
  {
    id: 'name',
    label: 'Nome',
  },
  {
    id: 'email',
    label: 'Email',
  },
  {
    id: 'phone',
    label: 'Telefone',
  },
  {
    id: 'birthdate',
    label: 'Data de nascimento',
  },
  {
    id: 'CPF',
    label: 'CPF',
  },
  {
    id: 'maritalStatus',
    label: 'Estado civil',
  },
  {
    id: 'sex',
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
          <PatientsTable patients={patients} columns={columns} />
        </CustomBox>
      </Content>
    </Container>
  );
};

export default Patients;
