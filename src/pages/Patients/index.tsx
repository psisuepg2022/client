import React, { useEffect, useRef, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import AlterTopToolbar from '@components/AlterTopToolbar';
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
  NoRowsContainer,
  NoRowsText,
} from './styles';
import PatientsTable from './table';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import logoPSIS from '@assets/PSIS-Logo-Invertido-Transparente.png';
import CircularProgressWithContent from '@components/CircularProgressWithContent';
import ControlledInput from '@components/ControlledInput';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '@contexts/Patients';
import { showAlert } from '@utils/showAlert';
import { Column } from './types';
import { PageSize } from '@global/constants';
import { colors } from '@global/colors';
import { Patient } from '@models/Patient';
import { useAuth } from '@contexts/Auth';
import { showToast } from '@utils/showToast';

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

const Patients = (): JSX.Element => {
  const { patients, list, count, remove, professionalPatients } = usePatients();
  const formMethods = useForm();
  const {
    user: { permissions },
  } = useAuth();
  const { handleSubmit, setValue } = formMethods;
  const navigate = useNavigate();
  const searchActive = useRef(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [filter, setFilter] = useState<string>();

  useEffect(() => {
    return () => {
      localStorage.removeItem('@psis:goToPatient');
    };
  });

  useEffect(() => {
    const redirectName = localStorage.getItem('@psis:goToPatient');
    if (redirectName && redirectName !== '') {
      setValue('search_filter', redirectName);
      onSubmit({ search_filter: redirectName });
      return;
    }

    if (searchActive.current) return;
    (async () => {
      try {
        setLoading(true);
        if (permissions.includes('USER_TYPE_PROFESSIONAL')) {
          await professionalPatients({
            size: PageSize,
            page,
            composed: filter,
          });
        } else {
          await list({
            size: PageSize,
            page,
            composed: filter,
          });
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
    })();
  }, [page]);

  const onSubmit = async (data: FieldValues): Promise<void> => {
    const searchData: { search_filter: string } = data as {
      search_filter: string;
    };

    setFilter(searchData?.search_filter || '');

    setLoading(true);
    searchActive.current = true;
    setPage(0);
    try {
      if (permissions.includes('USER_TYPE_PROFESSIONAL')) {
        await professionalPatients({
          size: PageSize,
          page: 0,
          composed: searchData?.search_filter || '',
        });
        return;
      }
      await list({
        size: PageSize,
        page: 0,
        composed: searchData?.search_filter || '',
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        text: e?.response?.data?.message || 'Ocorreu um problema inesperado',
        icon: 'error',
      });
    } finally {
      searchActive.current = false;
      setLoading(false);
    }
  };

  const deletePopup = (patient: Patient): void => {
    showAlert({
      title: 'Tem certeza que deseja deletar?',
      text: 'Esta ação não poderá ser revertida!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: colors.DANGER,
      confirmButtonText: 'DELETAR',
      cancelButtonColor: colors.BACKGREY,
      cancelButtonText: '<span style="color: #000;"> CANCELAR</span>',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await handleDelete(patient);
      }
    });
  };

  const handleDelete = async (patient: Patient): Promise<void> => {
    try {
      const { message } = await remove(patient.id);
      await list({ size: PageSize, page });
      showToast({
        text: message,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        text: e.response.data.message,
        icon: 'error',
      });
    }
  };

  return (
    <Container>
      <AlterTopToolbar />
      <Content>
        <CustomBox>
          <BoxHeader>
            <TitleAndInputs>
              <PageTitle>Lista de Pacientes</PageTitle>
              <FormProvider {...formMethods}>
                <InputsForm id="search" onSubmit={handleSubmit(onSubmit)}>
                  <ControlledInput
                    name="search_filter"
                    label="Nome, CPF ou e-mail"
                    size="medium"
                    endFunction="clear"
                  />
                </InputsForm>
              </FormProvider>
            </TitleAndInputs>
            <ButtonsContainer>
              <StyledButton
                style={
                  !permissions.includes('CREATE_PATIENT')
                    ? { visibility: 'hidden' }
                    : {}
                }
                disabled={loading || !permissions.includes('CREATE_PATIENT')}
                onClick={() => navigate('/patients/form')}
              >
                ADICIONAR
              </StyledButton>
              <StyledButton disabled={loading} form="search" type="submit">
                BUSCAR
              </StyledButton>
            </ButtonsContainer>
          </BoxHeader>
          {loading ? (
            <div
              style={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CircularProgressWithContent
                content={<LogoContainer src={logoPSIS} />}
                size={200}
              />
            </div>
          ) : patients.length !== 0 ? (
            <PatientsTable
              patients={patients}
              columns={columns}
              count={count}
              page={page}
              setPage={(page: number) => setPage(page)}
              deleteItem={deletePopup}
            />
          ) : (
            <NoRowsContainer>
              <NoRowsText>Não foram encontrados pacientes</NoRowsText>
            </NoRowsContainer>
          )}
        </CustomBox>
      </Content>
    </Container>
  );
};

export default Patients;
