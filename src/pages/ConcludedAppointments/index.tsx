import React, { useEffect, useRef, useState } from 'react';
import AlterTopToolbar from '@components/AlterTopToolbar';
import {
  IconButton,
  TablePagination,
  Tooltip,
  Typography,
} from '@mui/material';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import {
  Container,
  BoxHeader,
  CustomBox,
  Content,
  CommentsTitle,
  LogoContainer,
  PatientName,
  CommentBox,
  ScheduleStatus,
  InputsForm,
  StyledButton,
} from './styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { showAlert } from '@utils/showAlert';
import { useComments } from '@contexts/Comments';
import { Patient } from '@models/Patient';
import logoPSIS from '@assets/PSIS-Logo-Invertido-Transparente.png';
import CircularProgressWithContent from '@components/CircularProgressWithContent';
import { PageSize } from '@global/constants';
import { colors } from '@global/colors';
import { isoToDate } from '@utils/isoToDate';
import { dateFormat } from '@utils/dateFormat';
import { useAuth } from '@contexts/Auth';
import { FormProvider, useForm } from 'react-hook-form';
import ControlledDatePicker from '@components/ControlledDatePicker';

type SearchProps = {
  start: Date | null;
  end: Date | null;
};

const ConcludedAppointments = (): JSX.Element => {
  const { state }: { state: Patient } = useLocation() as { state: Patient };
  const navigate = useNavigate();
  const {
    user: { baseDuration },
  } = useAuth();
  const { list, comments, count } = useComments();
  const formMethods = useForm<SearchProps>({
    defaultValues: {
      start: null,
      end: null,
    },
  });
  const { handleSubmit } = formMethods;
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const searchActive = useRef(false);

  useEffect(() => {
    if (searchActive.current) return;
    (async () => {
      try {
        setLoading(true);
        await list(
          {
            size: PageSize,
            page,
          },
          state.id
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        showAlert({
          icon: 'error',
          text:
            e?.response?.data?.message ||
            'Ocorreu um problema ao recuperar as consultas',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  const onSubmit = async (data: SearchProps): Promise<void> => {
    setLoading(true);
    searchActive.current = true;
    setPage(0);
    try {
      await list(
        {
          size: PageSize,
          page,
          filter: {
            start: data?.start
              ? dateFormat({
                  date: data.start as Date,
                  stringFormat: 'yyyy-MM-dd',
                })
              : null,
            end: data?.end
              ? dateFormat({
                  date: data.end as Date,
                  stringFormat: 'yyyy-MM-dd',
                })
              : null,
          },
        },
        state.id
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      showAlert({
        text:
          e?.response?.data?.message ||
          'Ocorreu um problema ao filtrar as anotações',
        icon: 'error',
      });
    } finally {
      searchActive.current = false;
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100vh',
        }}
      >
        <CircularProgressWithContent
          content={<LogoContainer src={logoPSIS} />}
          size={200}
        />
      </div>
    );

  return (
    <Container>
      <AlterTopToolbar />
      <Content>
        <CustomBox>
          <BoxHeader>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => navigate(-1)}>
                <AiOutlineLeft size={35} />
              </IconButton>
              <CommentsTitle>Consultas Concluídas</CommentsTitle>
              <AiOutlineRight size={25} style={{ color: '#707070' }} />
              <PatientName>{state.name}</PatientName>
            </div>
            <FormProvider {...formMethods}>
              <InputsForm id="search" onSubmit={handleSubmit(onSubmit)}>
                <ControlledDatePicker name="start" label="Data inicial" />
                <ControlledDatePicker name="end" label="Data final" />
              </InputsForm>
            </FormProvider>
            <StyledButton disabled={loading} form="search" type="submit">
              BUSCAR
            </StyledButton>
          </BoxHeader>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              paddingTop: '2rem',
            }}
          >
            {comments.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <Typography style={{ fontWeight: 600, fontSize: '1.2rem' }}>
                  Não existem consultas concluídas com anotações
                </Typography>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {comments.map((comment) => (
                  <CommentBox key={comment.appointmentDate}>
                    <ScheduleStatus>
                      Data da consulta:{' '}
                      <span>
                        {dateFormat({
                          date: isoToDate(`${comment.appointmentDate}`),
                          stringFormat: 'dd/MM/yyyy | HH:mm',
                        })}
                        {' - '}
                        {dateFormat({
                          date: isoToDate(
                            `${comment.appointmentDate}`,
                            true,
                            baseDuration
                          ),
                          stringFormat: 'HH:mm',
                        })}
                      </span>
                    </ScheduleStatus>
                    <ScheduleStatus>
                      Agendada em: <span>{comment.scheduledAt}</span>
                    </ScheduleStatus>
                    <ScheduleStatus>
                      Concluída em: <span>{comment.completedAt}</span>
                    </ScheduleStatus>
                    <Tooltip title="Abrir anotação">
                      <IconButton
                        style={{
                          width: 45,
                          height: 45,
                          justifySelf: 'flex-end',
                          marginRight: 20,
                        }}
                        onClick={() => {
                          navigate('/comment', {
                            state: {
                              start: comment.appointmentDate,
                              title: state.name,
                              resource: `CONCLUDED/${state.contactNumber}/${comment.id}`,
                            },
                          });
                        }}
                      >
                        <BsFillArrowRightCircleFill
                          size={35}
                          style={{ color: colors.PRIMARY }}
                        />
                      </IconButton>
                    </Tooltip>
                  </CommentBox>
                ))}
              </div>
            )}
            <TablePagination
              sx={{ overflow: 'hidden', minHeight: 60 }}
              rowsPerPageOptions={[]}
              component="div"
              count={count}
              rowsPerPage={PageSize}
              page={page}
              onPageChange={(e, page) => setPage(page)}
            />
          </div>
        </CustomBox>
      </Content>
    </Container>
  );
};

export default ConcludedAppointments;
