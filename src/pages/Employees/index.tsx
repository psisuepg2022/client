import React, { useEffect, useRef, useState } from 'react';
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
import logoPSIS from '@assets/PSIS-Logo-Invertido-Transparente.png';
import CircularProgressWithContent from '@components/CircularProgressWithContent';
import ControlledInput from '@components/ControlledInput';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { showAlert } from '@utils/showAlert';
import { Column } from './types';
import { PageSize } from '@global/constants';
import { colors } from '@global/colors';
import { useEmployees } from '@contexts/Employees';
import { useAuth } from '@contexts/Auth';
import { Employee } from '@models/Employee';
import EmployeesTable from './table';
import { showToast } from '@utils/showToast';

const columns: Column[] = [
  {
    id: 0,
    label: 'Nome',
  },
  {
    id: 1,
    label: 'CPF',
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

const Employees = (): JSX.Element => {
  const { employees, list, count, remove } = useEmployees();
  const formMethods = useForm();
  const { handleSubmit } = formMethods;
  const navigate = useNavigate();
  const searchActive = useRef(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const {
    user: { permissions },
  } = useAuth();
  const [filter, setFilter] = useState<string>();

  useEffect(() => {
    if (searchActive.current) return;
    (async () => {
      try {
        setLoading(true);
        await list({
          size: PageSize,
          page,
          composed: filter || '',
        });
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

  const deletePopup = (employee: Employee): void => {
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
        await handleDelete(employee);
      }
    });
  };

  const handleDelete = async (employee: Employee): Promise<void> => {
    try {
      await remove(employee.id);
      await list({ size: PageSize, page });
      showToast({
        text: 'Operação realizada com sucesso!',
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
              <PageTitle>Lista de Funcionários</PageTitle>
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
                  !permissions.includes('CREATE_EMPLOYEE')
                    ? { visibility: 'hidden' }
                    : {}
                }
                disabled={loading || !permissions.includes('CREATE_EMPLOYEE')}
                onClick={() => navigate('/employees/form')}
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
          ) : employees.length !== 0 ? (
            <EmployeesTable
              employees={employees}
              columns={columns}
              count={count}
              page={page}
              setPage={(page: number) => setPage(page)}
              deleteItem={deletePopup}
            />
          ) : (
            <NoRowsContainer>
              <NoRowsText>Não foram encontrados funcionários</NoRowsText>
            </NoRowsContainer>
          )}
        </CustomBox>
      </Content>
    </Container>
  );
};

export default Employees;
