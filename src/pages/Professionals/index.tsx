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
import ProfessionalsTable from './table';
import { useProfessionals } from '@contexts/Professionals';
import { Professional } from '@models/Professional';
import { useAuth } from '@contexts/Auth';
import { showToast } from '@utils/showToast';
import { useSchedule } from '@contexts/Schedule';

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

const Professionals = (): JSX.Element => {
  const { professionals, list, count, remove } = useProfessionals();
  const formMethods = useForm();
  const { setCurrentProfessional } = useSchedule();
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

  const deletePopup = (professional: Professional): void => {
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
        await handleDelete(professional);
      }
    });
  };

  const handleDelete = async (professional: Professional): Promise<void> => {
    try {
      const { content } = await remove(professional.id);
      await list({ size: PageSize, page });

      setCurrentProfessional({} as Professional);
      if (content && content.patientsToCall.length > 0) {
        showAlert({
          title: 'Atenção!',
          text: '',
          html: `<div><p>${
            content.header
          } Entre em contato com os seguintes pacientes:</p><ul>${content.patientsToCall.reduce(
            (prev, cur) =>
              `<li>${cur.name}${
                cur.contactNumber ? ` - ${cur.contactNumber}` : ''
              }${cur.email ? ` - ${cur.email}` : ''}</li>${prev}`,
            ''
          )}</ul></div>`,
          icon: 'warning',
        });
      } else {
        showToast({
          text: 'Operação realizada com sucesso!',
        });
      }
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
              <PageTitle>Lista de Profissionais</PageTitle>
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
                  !permissions.includes('CREATE_PROFESSIONAL')
                    ? { visibility: 'hidden' }
                    : {}
                }
                disabled={
                  loading || !permissions.includes('CREATE_PROFESSIONAL')
                }
                onClick={() => navigate('/professionals/form')}
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
          ) : professionals.length !== 0 ? (
            <ProfessionalsTable
              professionals={professionals}
              columns={
                permissions.includes('DELETE_PROFESSIONAL') ||
                permissions.includes('UPDATE_PROFESSIONAL')
                  ? columns
                  : columns.filter((column) => column.id !== 4)
              }
              count={count}
              page={page}
              setPage={(page: number) => setPage(page)}
              deleteItem={deletePopup}
            />
          ) : (
            <NoRowsContainer>
              <NoRowsText>Não foram encontrados profissionais</NoRowsText>
            </NoRowsContainer>
          )}
        </CustomBox>
      </Content>
    </Container>
  );
};

export default Professionals;
