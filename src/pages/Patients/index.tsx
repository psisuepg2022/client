import React, { useEffect, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import AlterTopToolbar from '../../components/AlterTopToolbar';
import { api } from '../../service';
import { Column, Patient } from '../../types';
import { BoxHeader, Container, Content, CustomBox, PageTitle, LogoContainer } from './styles';
import PatientsTable from './table';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import logoPSIS from '../../assets/PSIS-Logo-Invertido-Transparente.png';
import CircularProgressWithContent from '../../components/CircularProgressWithContent';

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
                  <PageTitle>Lista de Pacientes</PageTitle>
                </BoxHeader>
                <PatientsTable patients={patients} columns={columns} />
              </CustomBox>
        }
 
      </Content>
    </Container>
  );
};

export default Patients;
