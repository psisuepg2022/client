import React, { useEffect, useRef, useState } from 'react';
import {
  FormControl,
  IconButton,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
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
  StyledSelect,
  StyledMenuItem,
  StyledInputLabel,
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
import { SearchFilter } from '@interfaces/SearchFilter';
import { PageSize } from '@global/constants';
import { colors } from '@global/colors';
import { Patient } from '@models/Patient';

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
  const { patients, list, count, remove } = usePatients();
  const formMethods = useForm();
  const { handleSubmit, reset } = formMethods;
  const navigate = useNavigate();
  const searchActive = useRef(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>('name');
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    if (searchActive.current) return;
    (async () => {
      try {
        setLoading(true);
        await list({
          size: PageSize,
          page,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        showAlert({
          text: e.response.data.message || 'Ocorreu um problema inesperado',
          icon: 'error',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  const onSubmit = async (data: FieldValues): Promise<void> => {
    const searchData: SearchFilter = data as SearchFilter;

    setLoading(true);
    searchActive.current = true;
    setPage(0);
    try {
      await list({
        size: PageSize,
        filter: {
          name: searchData?.name || '',
          CPF: searchData?.CPF || '',
          email: searchData?.email || '',
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        text: e.response.data.message || 'Ocorreu um problema inesperado',
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
      await remove(patient.id);
      await list({ size: PageSize, page });
      showAlert({
        title: 'Sucesso!',
        text: 'O paciente foi deletado com sucesso!',
        icon: 'success',
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        text: e.response.data.message,
        icon: 'error',
      });
    }
  };

  const getSearchInput = (): JSX.Element => {
    if (category === 'name') {
      return (
        <ControlledInput
          name={category}
          label="Nome"
          size="medium"
          endFunction="clear"
        />
      );
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
          endFunction="clear"
        />
      );
    }

    return (
      <ControlledInput
        name={category}
        label="Email"
        size="medium"
        endFunction="clear"
      />
    );
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
                  {getSearchInput()}
                  <FormControl>
                    <StyledInputLabel>Categoria</StyledInputLabel>
                    <StyledSelect
                      name="category"
                      label="Categoria"
                      notched
                      defaultValue="name"
                      onChange={(e: SelectChangeEvent<unknown>) => {
                        setCategory(e.target.value as string);
                        reset();
                      }}
                      value={category}
                    >
                      <StyledMenuItem value="name">Nome</StyledMenuItem>
                      <StyledMenuItem value="CPF">CPF</StyledMenuItem>
                      <StyledMenuItem value="email">Email</StyledMenuItem>
                    </StyledSelect>
                  </FormControl>
                </InputsForm>
              </FormProvider>
            </TitleAndInputs>
            <ButtonsContainer>
              <StyledButton
                disabled={loading}
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
          ) : (
            <PatientsTable
              patients={patients}
              columns={columns}
              count={count}
              page={page}
              setPage={(page: number) => setPage(page)}
              deleteItem={deletePopup}
            />
          )}
        </CustomBox>
      </Content>
    </Container>
  );
};

export default Patients;
